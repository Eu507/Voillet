export const theme = {
  colors: {
    deepVault: "#012b2a",
    tealShadow: "#1a4a46",
    vaultMid: "#2e6b65",
    mintSignal: "#9effd4",
    mintCore: "#5fdbb2",
    mintGhost: "#c8fff0",
    violetVoice: "#a78bff",
    violetDeep: "#7c5cdb",
    violetMist: "#e8e0ff",
    offBlack: "#0d1f1e",
    offWhite: "#e8f5f0",
    mutedSage: "#97b5b1",
    goldPending: "#f4b942",
    coralAlert: "#ff6b6b",
    mintConfirm: "#5fdbb2",
  },
  radius: {
    lg: "28px",
    md: "20px",
    sm: "14px",
  },
  shadow: {
    shell: "0 24px 80px rgba(0, 0, 0, 0.32)",
    card: "0 18px 45px rgba(1, 43, 42, 0.34)",
    glow: "0 0 0 1px rgba(158, 255, 212, 0.08), 0 18px 60px rgba(95, 219, 178, 0.18)",
  },
} as const;

export type Theme = typeof theme;
