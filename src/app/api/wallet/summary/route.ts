import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getWalletSummary } from "@/core/solana/wallet-summary";
import { resolveWalletNetwork } from "@/core/solana/connection";

export const runtime = "nodejs";

const walletSummarySchema = z.object({
  address: z.string().min(32),
  network: z.enum(["devnet", "mainnet-beta"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const parsed = walletSummarySchema.parse({
      address: request.nextUrl.searchParams.get("address"),
      network: request.nextUrl.searchParams.get("network") ?? undefined,
    });
    const summary = await getWalletSummary(
      parsed.address,
      resolveWalletNetwork(parsed.network),
    );

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load wallet summary.",
      },
      { status: 400 },
    );
  }
}
