import { getTable, hitTestTable, tablesForParty } from "../tables";

describe("tables", () => {
  it("finds a four-top", () => {
    expect(getTable("t4")?.seats).toBe(4);
  });

  it("filters tables that can seat a party of 5", () => {
    const ids = tablesForParty(5).map((table) => table.id);
    expect(ids).toEqual(["t8", "t9"]);
  });

  it("hit-tests the center of a patio two-top", () => {
    const table = getTable("p1");
    expect(table).toBeDefined();
    expect(hitTestTable(table!.x + table!.w / 2, table!.y + table!.h / 2)?.id).toBe("p1");
  });
});
