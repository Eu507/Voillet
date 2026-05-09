import { theme } from "@/configs/theme";

describe("theme", () => {
  it("keeps the Voillet palette tokens available", () => {
    expect(theme.colors.deepVault).toBe("#012b2a");
    expect(theme.colors.mintSignal).toBe("#9effd4");
    expect(theme.colors.violetVoice).toBe("#a78bff");
  });
});
