import {
  getClientIp,
  hashPassword,
  setSession,
  supabaseRequest,
  verifyPassword
} from "@/lib/auth";
import { redirect } from "next/navigation";

async function logEvent({ userId, username, role, success }) {
  await supabaseRequest("login_events", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId || null,
      username,
      role,
      success,
      ip: await getClientIp()
    })
  });
}

export async function POST(request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    await setSession({ id: "admin", username, role: "admin" });
    await logEvent({ username, role: "admin", success: true });
    redirect("/admin");
  }

  const users = await supabaseRequest(
    `app_users?username=eq.${encodeURIComponent(username)}&select=*`
  );
  const user = users[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    await logEvent({ username, role: "customer", success: false });
    redirect("/login?error=1");
  }

  await supabaseRequest(`app_users?id=eq.${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({ last_login_at: new Date().toISOString() })
  });
  await setSession({ id: user.id, username: user.username, role: "customer" });
  await logEvent({ userId: user.id, username: user.username, role: "customer", success: true });
  redirect("/dashboard");
}
