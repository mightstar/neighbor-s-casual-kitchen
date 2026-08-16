import { searchMenu } from "../menu";

describe("searchMenu", () => {
  it("finds the brunch signature", () => {
    const hits = searchMenu("benedict");
    expect(hits.some((item) => item.id === "pulled-pork-benedict")).toBe(true);
  });

  it("returns featured dishes for an empty query", () => {
    expect(searchMenu("").length).toBeGreaterThan(0);
  });
});
