import { NextRequest } from "next/server";

const API_URL = "https://api.bookingmood.com/v1";

export async function POST(request: NextRequest) {
  const { member_id, product_id } = await request.json();

  await fetch(`${API_URL}/members?id=${member_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
  });

  await fetch(`${API_URL}/products?id=${product_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
  });

  return new Response("OK");
}
