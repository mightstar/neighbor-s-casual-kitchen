import { NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { databaseErrorMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { validateSignup } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const error = validateSignup({ name, email, password });
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
      },
    });

    const session = { id: user.id, name: user.name, email: user.email };
    await setSessionCookie(session);
    return NextResponse.json({ user: session });
  } catch (error) {
    return NextResponse.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}
