import {
  deriveActivityKind,
  deriveActivityStatus,
} from "@/core/solana/activity";

describe("solana activity helpers", () => {
  it("classifies incoming balance changes as received", () => {
    expect(deriveActivityKind(1_000_000_000, "confirmed")).toBe("received");
  });

  it("classifies pending zero-delta activity as unknown", () => {
    expect(deriveActivityKind(0, "pending")).toBe("unknown");
  });

  it("maps failed signatures to failed status", () => {
    expect(deriveActivityStatus("confirmed", true)).toBe("failed");
  });
});
