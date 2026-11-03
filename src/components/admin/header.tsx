import { auth } from "@/lib/auth";
import { AdminHeaderClient } from "@/components/admin/admin-header-client";

export async function AdminHeader({ title }: { title: string }) {
  const session = await auth();

  return (
    <AdminHeaderClient
      title={title}
      user={
        session?.user
          ? { name: session.user.name, role: session.user.role }
          : null
      }
    />
  );
}
