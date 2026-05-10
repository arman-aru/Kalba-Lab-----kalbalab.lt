import type { Metadata } from "next";

// Everything under (protected) requires auth and renders user-specific data.
// We do not want any of this in search indexes or AI training crawls.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
