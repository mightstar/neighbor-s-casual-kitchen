import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "nck_session";
const SALT_ROUNDS = 10;

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(value);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSession(token: string) {
  const { payload } = await jwtVerify(token, secret());
  if (!payload.id || !payload.email || !payload.name) return null;
  return {
    id: String(payload.id),
    name: String(payload.name),
    email: String(payload.email),
  } satisfies SessionUser;
}

export async function setSessionCookie(user: SessionUser) {
  const token = await signSession(user);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return await readSession(token);
  } catch {
    return null;
  }
}
