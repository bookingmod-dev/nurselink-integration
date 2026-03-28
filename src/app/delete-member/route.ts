import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.bookingmood.com/v1";

export async function POST(request: NextRequest) {
  try {
    const { member_id, product_id } = await request.json();
    console.log("[delete-member] Starting:", { member_id, product_id });

    // ✅ Correct format — direct id value
    const memberRes = await fetch(`${API_URL}/members?id=${member_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}`,
      },
    });
    console.log("[delete-member] member status:", memberRes.status);

    // ✅ Correct format — direct id value
    const productRes = await fetch(`${API_URL}/products?id=${product_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}`,
      },
    });
    console.log("[delete-member] product status:", productRes.status);

    return NextResponse.json({ success: true });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[delete-member] FATAL:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}