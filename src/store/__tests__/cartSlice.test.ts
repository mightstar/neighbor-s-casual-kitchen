import { addItem, cartReducer, removeItem, setQuantity } from "../cartSlice";

describe("cartSlice", () => {
  it("adds a documented menu item", () => {
    const state = cartReducer({ lines: [], hydrated: true }, addItem({ id: "barnyard-burger" }));
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].name).toBe("The Barnyard Burger");
    expect(state.lines[0].priceCents).toBe(955);
  });

  it("increments quantity for the same item", () => {
    const once = cartReducer({ lines: [], hydrated: true }, addItem({ id: "mimosa" }));
    const twice = cartReducer(once, addItem({ id: "mimosa", quantity: 2 }));
    expect(twice.lines[0].quantity).toBe(3);
  });

  it("removes a line when quantity hits zero", () => {
    const added = cartReducer({ lines: [], hydrated: true }, addItem({ id: "mimosa" }));
    const empty = cartReducer(added, setQuantity({ id: "mimosa", quantity: 0 }));
    expect(empty.lines).toHaveLength(0);
  });

  it("removes by id", () => {
    const added = cartReducer({ lines: [], hydrated: true }, addItem({ id: "salmon" }));
    const empty = cartReducer(added, removeItem("salmon"));
    expect(empty.lines).toHaveLength(0);
  });
});
