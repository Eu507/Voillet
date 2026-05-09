// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/solana/wallet-summary", () => ({
  getWalletSummary: vi.fn(),
}));

import { getWalletSummary } from "@/core/solana/wallet-summary";
import { GET } from "@/app/api/wallet/summary/route";

describe("GET /api/wallet/summary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns a wallet summary payload", async () => {
    vi.mocked(getWalletSummary).mockResolvedValue({
      address: "9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
      network: "devnet",
      solBalance: {
        rawLamports: "1000000000",
        formattedAmount: "1",
      },
      assets: [],
      activityPreview: [],
    });

    const request = new NextRequest(
      "http://localhost/api/wallet/summary?address=9xQeWvG816bUx9EPjHmaT23yvVMuNerJw9A62rQd8s8m",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.network).toBe("devnet");
  });

  it("returns 400 when address is missing", async () => {
    const request = new NextRequest("http://localhost/api/wallet/summary");
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});
