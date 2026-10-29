import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminPanel />;
}
