import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import { users } from "@/lib/users";

interface SessionData {
  email?: string;
}

const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "sid",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  const cookiesStore = await cookies();
  const session = await getIronSession<SessionData>(cookiesStore, sessionOptions);
  session.email = email;
  await session.save();

  return Response.json({ ok: true,  email: user.email  });
}
