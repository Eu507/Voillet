import { buildAssistantResponse } from "@/core/assistant/respond";
import type { AssistantRequest } from "@/core/types/assistant";
import type { WalletSummary } from "@/core/types/wallet";

const mockSummary: WalletSummary = {
  address: "9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
  network: "devnet",
  solBalance: {
    rawLamports: "2200000000",
    formattedAmount: "2.2",
  },
  assets: [
    {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      name: "USD Coin",
      rawAmount: "5000000",
      formattedAmount: "5",
      isNative: false,
    },
  ],
  activityPreview: [
    {
      signature: "5bD1mQjUqMQLcrpC9mQozG7WkGz1tFaJ4s7bnRw2sN8n",
      kind: "received",
      status: "confirmed",
      timestamp: Math.round(Date.now() / 1000) - 120,
      amount: "+0.75 SOL",
      symbol: "SOL",
      explorerUrl: "https://explorer.solana.com",
    },
  ],
};

describe("buildAssistantResponse", () => {
  it("returns balance guidance for balance prompts", () => {
    const request: AssistantRequest = {
      mode: "text",
      transcript: "what is my balance?",
      walletAddress: mockSummary.address,
    };

    const response = buildAssistantResponse(request, mockSummary);

    expect(response.intent).toBe("balance_overview");
    expect(response.message).toContain("2.2 SOL");
  });

  it("returns connect guidance when no wallet is present", () => {
    const request: AssistantRequest = {
      mode: "text",
      transcript: "show me my balance",
    };

    const response = buildAssistantResponse(request);

    expect(response.intent).toBe("unsupported");
    expect(response.message).toContain("Connect a wallet first");
  });
});
