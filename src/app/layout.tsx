import type { Metadata } from "next";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@/app/globals.css";

import { ClientProviders } from "@/app/ClientProviders";
import { AppShell } from "@/presentation/components/AppShell";

export const metadata: Metadata = {
  title: "Voillet",
  description: "Voice-native Solana wallet demo for the hackathon build.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
