import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Manual approval queue.
 * TODO: persist to Supabase. This stub validates the payload and does not store it.
 */

const MAX_NAME = 40;
const MAX_HREF = 200;
const MAX_MESSAGE = 140;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Send JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "Missing request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const href = typeof data.href === "string" ? data.href.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const spotId = typeof data.spotId === "string" ? data.spotId.slice(0, 80) : "";

  if (!spotId) {
    return NextResponse.json({ ok: false, message: "Missing spot." }, { status: 400 });
  }
  if (spotId === "reelstyles") {
    return NextResponse.json({ ok: false, message: "The barn is not for sale." }, { status: 400 });
  }
  if (name.length < 1 || name.length > MAX_NAME) {
    return NextResponse.json({ ok: false, message: "Add a name (40 characters or fewer)." }, { status: 400 });
  }
  if (href) {
    if (href.length > MAX_HREF || !/^https?:\/\//i.test(href)) {
      return NextResponse.json({ ok: false, message: "Link must start with http:// or https://." }, { status: 400 });
    }
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, message: "Message is too long." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    status: "queued",
    id: crypto.randomUUID(),
    message:
      "Received. A person will approve this before it shows on the farm. Storage is not wired yet (TODO: Supabase).",
  });
}
