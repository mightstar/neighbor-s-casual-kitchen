export type TableShape = "round" | "square" | "rect" | "booth" | "bar";
export type TableZone = "patio" | "dining" | "booth" | "bar";

export type FloorTable = {
  id: string;
  label: string;
  seats: 2 | 4 | 6;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: TableShape;
  zone: TableZone;
};

export const FLOOR_WIDTH = 1000;
export const FLOOR_HEIGHT = 640;

export const floorTables: FloorTable[] = [
  { id: "p1", label: "P1", seats: 2, x: 70, y: 88, w: 56, h: 56, shape: "round", zone: "patio" },
  { id: "p2", label: "P2", seats: 2, x: 70, y: 200, w: 56, h: 56, shape: "round", zone: "patio" },
  { id: "p3", label: "P3", seats: 4, x: 58, y: 320, w: 80, h: 80, shape: "square", zone: "patio" },
  { id: "p4", label: "P4", seats: 4, x: 58, y: 450, w: 80, h: 80, shape: "square", zone: "patio" },
  { id: "t1", label: "1", seats: 2, x: 270, y: 86, w: 54, h: 54, shape: "round", zone: "dining" },
  { id: "t2", label: "2", seats: 2, x: 370, y: 86, w: 54, h: 54, shape: "round", zone: "dining" },
  { id: "t3", label: "3", seats: 2, x: 470, y: 86, w: 54, h: 54, shape: "round", zone: "dining" },
  { id: "t4", label: "4", seats: 4, x: 280, y: 210, w: 78, h: 78, shape: "square", zone: "dining" },
  { id: "t5", label: "5", seats: 4, x: 420, y: 210, w: 78, h: 78, shape: "square", zone: "dining" },
  { id: "t6", label: "6", seats: 4, x: 280, y: 340, w: 78, h: 78, shape: "square", zone: "dining" },
  { id: "t7", label: "7", seats: 4, x: 420, y: 340, w: 78, h: 78, shape: "square", zone: "dining" },
  { id: "t8", label: "8", seats: 6, x: 250, y: 490, w: 130, h: 70, shape: "booth", zone: "booth" },
  { id: "t9", label: "9", seats: 6, x: 420, y: 490, w: 130, h: 70, shape: "booth", zone: "booth" },
  { id: "b1", label: "B1", seats: 2, x: 700, y: 200, w: 50, h: 50, shape: "bar", zone: "bar" },
  { id: "b2", label: "B2", seats: 2, x: 700, y: 280, w: 50, h: 50, shape: "bar", zone: "bar" },
  { id: "b3", label: "B3", seats: 2, x: 700, y: 360, w: 50, h: 50, shape: "bar", zone: "bar" },
  { id: "b4", label: "B4", seats: 4, x: 800, y: 250, w: 72, h: 72, shape: "square", zone: "bar" },
];

export const durationOptions = [60, 90, 120] as const;

export function getTable(id: string) {
  return floorTables.find((table) => table.id === id);
}

export function tablesForParty(partySize: number) {
  return floorTables.filter((table) => table.seats >= partySize);
}

export function hitTestTable(x: number, y: number): FloorTable | undefined {
  return floorTables.find((table) => {
    const pad = table.shape === "round" ? 0 : 0;
    return (
      x >= table.x - pad &&
      x <= table.x + table.w + pad &&
      y >= table.y - pad &&
      y <= table.y + table.h + pad
    );
  });
}

export function zoneLabel(zone: TableZone) {
  switch (zone) {
    case "patio":
      return "Patio";
    case "dining":
      return "Dining room";
    case "booth":
      return "Booth";
    case "bar":
      return "Bar";
  }
}
