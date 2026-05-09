// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/solana/wallet-summary", () => ({
  getWalletSummary: vi.fn(),
}));

import { getWalletSummary } from "@/core/solana/wallet-summary";
import { POST } from "@/app/api/assistant/respond/route";

describe("POST /api/assistant/respond", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns a read-only assistant response for a wallet question", async () => {
    vi.mocked(getWalletSummary).mockResolvedValue({
      address: "9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
      network: "devnet",
      solBalance: {
        rawLamports: "1800000000",
        formattedAmount: "1.8",
      },
      assets: [],
      activityPreview: [],
    });

    const request = new Request("http://localhost/api/assistant/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "text",
        transcript: "what is my balance?",
        walletAddress: "9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
      }),
    });
    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.intent).toBe("balance_overview");
  });
});
