import { hashPassword, requireSession, supabaseRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(request) {
  await requireSession("admin");
  const formData = await request.formData();
  const userId = String(formData.get("userId") || "");
  const password = String(formData.get("password") || "");

  if (!userId || password.length < 8) {
    redirect("/admin?error=password");
  }

  await supabaseRequest(`app_users?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify({ password_hash: hashPassword(password) })
  });
  redirect("/admin");
}
