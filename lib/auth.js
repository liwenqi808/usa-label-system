import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "usa_label_session";

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseConfig() {
  return {
    url: getEnv("SUPABASE_URL").replace(/\/$/, ""),
    key: getEnv("SUPABASE_SECRET_KEY")
  };
}

export async function supabaseRequest(path, init = {}) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=representation",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [method, rounds, salt, expected] = storedHash.split("$");
  if (method !== "pbkdf2_sha256" || !rounds || !salt || !expected) {
    return false;
  }

  const actual = crypto.pbkdf2Sync(password, salt, Number(rounds), 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function signSession(payload) {
  const secret = getEnv("APP_SECRET");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function readSessionToken(token) {
  if (!token) {
    return null;
  }

  const [data, signature] = token.split(".");
  if (!data || !signature) {
    return null;
  }

  const expected = crypto.createHmac("sha256", getEnv("APP_SECRET")).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  if (!payload.expiresAt || Date.now() > payload.expiresAt) {
    return null;
  }

  return payload;
}

export async function setSession(payload) {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    signSession({
      ...payload,
      expiresAt: Date.now() + 1000 * 60 * 60 * 12
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12
    }
  );
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession(role) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (role && session.role !== role) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }

  return session;
}

export async function getClientIp() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

export function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let index = 0; index < 8; index += 1) {
    value += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return `${value.slice(0, 4)}-${value.slice(4)}`;
}
