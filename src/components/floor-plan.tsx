"use client";

import { useEffect, useRef } from "react";
import {
  FLOOR_HEIGHT,
  FLOOR_WIDTH,
  floorTables,
  hitTestTable,
  type FloorTable,
} from "@/lib/tables";

type Status = "available" | "booked" | "small" | "selected";

function tableStatus(
  table: FloorTable,
  bookedIds: string[],
  partySize: number,
  selectedId: string | null,
): Status {
  if (selectedId === table.id) return "selected";
  if (bookedIds.includes(table.id)) return "booked";
  if (table.seats < partySize) return "small";
  return "available";
}

function fillFor(status: Status) {
  switch (status) {
    case "selected":
      return "#c45c32";
    case "booked":
      return "#b7aa97";
    case "small":
      return "#d9cfc0";
    default:
      return "#2a4538";
  }
}

function drawTable(
  ctx: CanvasRenderingContext2D,
  table: FloorTable,
  status: Status,
  hoverId: string | null,
) {
  const { x, y, w, h } = table;
  ctx.save();
  ctx.fillStyle = fillFor(status);
  ctx.strokeStyle = hoverId === table.id ? "#1b1712" : "rgba(27,23,18,0.18)";
  ctx.lineWidth = hoverId === table.id ? 3 : 1;

  if (table.shape === "round") {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (table.shape === "booth") {
    roundRect(ctx, x, y, w, h, 18);
    ctx.fill();
    ctx.stroke();
  } else {
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = status === "small" ? "#5c5348" : "#fbf6ee";
  ctx.font = "600 14px Figtree, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(table.label, x + w / 2, y + h / 2 - 7);
  ctx.font = "12px Figtree, sans-serif";
  ctx.fillText(`${table.seats} seats`, x + w / 2, y + h / 2 + 9);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paint(
  ctx: CanvasRenderingContext2D,
  bookedIds: string[],
  partySize: number,
  selectedId: string | null,
  hoverId: string | null,
) {
  ctx.clearRect(0, 0, FLOOR_WIDTH, FLOOR_HEIGHT);

  ctx.fillStyle = "#efe4d2";
  roundRect(ctx, 20, 20, 960, 600, 28);
  ctx.fill();

  ctx.fillStyle = "#d7e0c8";
  roundRect(ctx, 36, 40, 150, 560, 20);
  ctx.fill();
  ctx.fillStyle = "#2a4538";
  ctx.font = "600 12px Figtree, sans-serif";
  ctx.fillText("PATIO", 111, 62);

  ctx.fillStyle = "#e7dcc8";
  roundRect(ctx, 210, 40, 430, 560, 20);
  ctx.fill();
  ctx.fillStyle = "#5c5348";
  ctx.fillText("DINING ROOM", 425, 62);

  ctx.fillStyle = "#ddd2bf";
  roundRect(ctx, 660, 160, 300, 320, 20);
  ctx.fill();
  ctx.fillStyle = "#2a4538";
  ctx.fillText("BAR", 810, 182);

  ctx.fillStyle = "#c9bba6";
  roundRect(ctx, 700, 40, 260, 100, 16);
  ctx.fill();
  ctx.fillStyle = "#5c5348";
  ctx.fillText("KITCHEN", 830, 92);

  ctx.strokeStyle = "#c4b49a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(196, 70);
  ctx.lineTo(196, 580);
  ctx.stroke();

  for (const table of floorTables) {
    drawTable(ctx, table, tableStatus(table, bookedIds, partySize, selectedId), hoverId);
  }
}

export function FloorPlan({
  bookedIds,
  partySize,
  selectedId,
  onSelect,
}: {
  bookedIds: string[];
  partySize: number;
  selectedId: string | null;
  onSelect: (table: FloorTable) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = (width * FLOOR_HEIGHT) / FLOOR_WIDTH;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.scale(width / FLOOR_WIDTH, height / FLOOR_HEIGHT);
      paint(ctx, bookedIds, partySize, selectedId, hoverRef.current);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [bookedIds, partySize, selectedId]);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * FLOOR_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * FLOOR_HEIGHT;
    return { x, y };
  }

  function redraw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth;
    const height = (width * FLOOR_HEIGHT) / FLOOR_WIDTH;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.scale(width / FLOOR_WIDTH, height / FLOOR_HEIGHT);
    paint(ctx, bookedIds, partySize, selectedId, hoverRef.current);
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-auto w-full cursor-pointer rounded-[28px] bg-sand"
      style={{ aspectRatio: `${FLOOR_WIDTH} / ${FLOOR_HEIGHT}` }}
      onPointerMove={(event) => {
        const point = pointFromEvent(event);
        if (!point) return;
        const next = hitTestTable(point.x, point.y)?.id ?? null;
        if (next !== hoverRef.current) {
          hoverRef.current = next;
          redraw();
        }
      }}
      onPointerLeave={() => {
        hoverRef.current = null;
        redraw();
      }}
      onClick={(event) => {
        const point = pointFromEvent(event as unknown as React.PointerEvent<HTMLCanvasElement>);
        if (!point) return;
        const table = hitTestTable(point.x, point.y);
        if (!table) return;
        if (bookedIds.includes(table.id) || table.seats < partySize) return;
        onSelect(table);
      }}
    />
  );
}
