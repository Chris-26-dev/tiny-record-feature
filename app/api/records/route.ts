import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import { addRecord, getRecordsByUser } from "@/lib/db";

interface SessionData {
  email?: string;
}

const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "sid",
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
};

async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function GET() {
  const session = await getSession();

  if (!session.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const records = getRecordsByUser(session.email);
  return Response.json(records);
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { title, priority } = await req.json();

  if (!title || title.length < 3) {
    return new Response(JSON.stringify({ error: "Title too short" }), {
      status: 400,
    });
  }

  if (!["low", "med", "high"].includes(priority)) {
    return new Response(JSON.stringify({ error: "Invalid priority" }), {
      status: 400,
    });
  }

  const newRecord = addRecord(session.email, title, priority);
  return Response.json(newRecord);
}
