import type { Metadata } from "next";

// Auth screens (login/register) shouldn't appear in search or AI answer panels.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
