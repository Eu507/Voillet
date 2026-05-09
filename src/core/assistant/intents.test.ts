import { detectAssistantIntent } from "@/core/assistant/intents";
import type { WalletSummary } from "@/core/types/wallet";

const mockSummary: WalletSummary = {
  address: "9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
  network: "devnet",
  solBalance: {
    rawLamports: "1250000000",
    formattedAmount: "1.25",
  },
  assets: [
    {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      name: "USD Coin",
      rawAmount: "1500000",
      formattedAmount: "1.5",
      isNative: false,
    },
  ],
  activityPreview: [],
};

describe("detectAssistantIntent", () => {
  it("recognizes token balance questions", () => {
    const result = detectAssistantIntent("how much usdc do I have?", mockSummary);

    expect(result.intent).toBe("token_balance");
    expect(result.matchedAsset?.symbol).toBe("USDC");
  });

  it("recognizes receive flow questions", () => {
    const result = detectAssistantIntent("show my receive qr", mockSummary);

    expect(result.intent).toBe("receive_help");
  });

  it("falls back to unsupported for unrelated prompts", () => {
    const result = detectAssistantIntent("tell me a joke", mockSummary);

    expect(result.intent).toBe("unsupported");
  });
});
