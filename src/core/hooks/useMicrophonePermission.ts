"use client";

import { useEffect, useState } from "react";

type MicrophonePermissionState =
  | PermissionState
  | "unsupported"
  | "checking";

export function useMicrophonePermission() {
  const [permission, setPermission] = useState<MicrophonePermissionState>(() => {
    if (typeof navigator === "undefined") {
      return "checking";
    }

    return "permissions" in navigator ? "checking" : "unsupported";
  });

  useEffect(() => {
    if (!("permissions" in navigator)) {
      return;
    }

    let mounted = true;
    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (!mounted) {
          return;
        }

        permissionStatus = status;
        setPermission(status.state);
        permissionStatus.onchange = () => setPermission(status.state);
      })
      .catch(() => {
        if (mounted) {
          setPermission("unsupported");
        }
      });

    return () => {
      mounted = false;

      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  return permission;
}
