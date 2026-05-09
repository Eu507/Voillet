import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getWalletActivity } from "@/core/solana/activity";
import { resolveWalletNetwork } from "@/core/solana/connection";

export const runtime = "nodejs";

const walletActivitySchema = z.object({
  address: z.string().min(32),
  limit: z.coerce.number().int().min(1).max(25).default(12),
  network: z.enum(["devnet", "mainnet-beta"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const parsed = walletActivitySchema.parse({
      address: request.nextUrl.searchParams.get("address"),
      limit: request.nextUrl.searchParams.get("limit") ?? 12,
      network: request.nextUrl.searchParams.get("network") ?? undefined,
    });
    const activity = await getWalletActivity(
      parsed.address,
      resolveWalletNetwork(parsed.network),
      parsed.limit,
    );

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load wallet activity.",
      },
      { status: 400 },
    );
  }
}
