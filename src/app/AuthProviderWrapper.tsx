"use client";

import { AuthProvider } from "@/context/AuthContext";

export function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
