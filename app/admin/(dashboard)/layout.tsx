import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdmin, supabaseConfigured } from "@/lib/supabase-server";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin · KalbaLab",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!supabaseConfigured()) {
    redirect("/admin/login?reason=unconfigured");
  }
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell user={{ email: session.profile.email, name: session.profile.full_name ?? null }}>
      {children}
    </AdminShell>
  );
}
