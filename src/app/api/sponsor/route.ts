/** No persistence provider is configured. Never acknowledge an unsaved request. */
export async function POST() {
  return Response.json(
    {
      ok: false,
      code: "SPONSORSHIP_UNAVAILABLE",
      message:
        "Online sponsorship requests are unavailable. Nothing has been saved. Please use the contact details in the Impressum.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
