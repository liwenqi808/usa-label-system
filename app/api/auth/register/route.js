import { hashPassword, setSession, supabaseRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(request) {
  const formData = await request.formData();
  const inviteCode = String(formData.get("inviteCode") || "").trim().toUpperCase();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const displayName = String(formData.get("displayName") || "").trim();

  if (!inviteCode || !username || password.length < 8) {
    redirect("/register?error=invalid");
  }

  const invites = await supabaseRequest(
    `invite_codes?code=eq.${encodeURIComponent(inviteCode)}&status=eq.open&select=*`
  );
  if (!invites[0]) {
    redirect("/register?error=invite");
  }

  const existing = await supabaseRequest(
    `app_users?username=eq.${encodeURIComponent(username)}&select=id`
  );
  if (existing.length > 0) {
    redirect("/register?error=username");
  }

  const users = await supabaseRequest("app_users", {
    method: "POST",
    body: JSON.stringify({
      username,
      display_name: displayName || username,
      invite_code: inviteCode,
      password_hash: hashPassword(password)
    })
  });
  const user = users[0];

  await supabaseRequest(`invite_codes?code=eq.${encodeURIComponent(inviteCode)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "used",
      used_at: new Date().toISOString(),
      used_by: user.id
    })
  });

  await setSession({ id: user.id, username: user.username, role: "customer" });
  redirect("/dashboard");
}
