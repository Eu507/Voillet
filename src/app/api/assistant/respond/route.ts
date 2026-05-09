import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { buildAssistantResponse } from "@/core/assistant/respond";
import { getWalletSummary } from "@/core/solana/wallet-summary";
import { resolveWalletNetwork } from "@/core/solana/connection";

export const runtime = "nodejs";

const assistantRequestSchema = z.object({
  mode: z.enum(["text", "voice"]),
  transcript: z.string().min(1),
  walletAddress: z.string().optional(),
  routeContext: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = assistantRequestSchema.parse(await request.json());
    const summary = payload.walletAddress
      ? await getWalletSummary(
          payload.walletAddress,
          resolveWalletNetwork(undefined),
        )
      : undefined;
    const response = buildAssistantResponse(payload, summary);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate assistant response.",
      },
      { status: 400 },
    );
  }
}
