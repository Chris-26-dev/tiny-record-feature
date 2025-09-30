import { cookies } from "next/headers";

export async function POST() {
    const cookiesStore = await cookies();
    cookiesStore.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });

    return Response.json({ ok: true });
}
