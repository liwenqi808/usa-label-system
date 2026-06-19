import { createInviteCode, requireSession, supabaseRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(request) {
  await requireSession("admin");
  const formData = await request.formData();
  const note = String(formData.get("note") || "").trim();
  let code = createInviteCode();
  let created = false;

  for (let attempts = 0; attempts < 3; attempts += 1) {
    try {
      await supabaseRequest("invite_codes", {
        method: "POST",
        body: JSON.stringify({ code, note })
      });
      created = true;
      break;
    } catch {
      code = createInviteCode();
    }
  }

  redirect(created ? "/admin" : "/admin?error=invite");
}
