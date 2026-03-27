import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.bookingmood.com/v1";


export async function POST(request: NextRequest) {
  const { member_email, member_name } = await request.json();


  const member = await fetch(`${API_URL}/members`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
    body: JSON.stringify({ email: member_email, name: member_name }),
  }).then((res) => res.json());

  const product = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
    body: JSON.stringify({
      name: { default: member_name },
      rent_period: "daily",
      timezone: "Pacific/Auckland",
    }),
  }).then((res) => res.json());

  await fetch(`${API_URL}/permissions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
    body: JSON.stringify([
      { product_id: product.id, member_id: member.id, permission: "all" },
    ]),
  });

  const [widget] = await fetch(`${API_URL}/widgets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
    body: JSON.stringify([
      {
        interaction: "book",
        organization_id: process.env.BOOKINGMOOD_ORGANIZATION_ID,
        settings: {
          // ✅ Fixed color field names (was the crash cause)
          color_available: "#22c55e",
          color_surface: "#fff",
          color_tentative: "#fcd34d",
          color_text: "#000",
          color_unavailable: "#faa5a5",

          // ✅ Required color fields that were missing
          color_booked: "#faa5a5",
          color_closed: "#e5e7eb",
          color_error: "#ef4444",
          color_info: "#3b82f6",
          color_primary: "#3b82f6",
          color_warning: "#f59e0b",

          // ✅ These were already correct
          display_legend: true,
          display_product_images: false,
          display_product_name: false,
          display_week_numbers: false,
          first_week_contains_date: null,
          interval_wrap_style: "square",
          number_of_months: null,
          rate_location: "inline",
          rate_visibility: "none",
          show_totals: false,
          show_yearly: false,
          size: "regular",
          theme: "modern",
          week_starts_on: null,
        },
        show_bookingmood_branding: false,
        show_past: false,
        // show_tentative_as: "TENTATIVE",
        title: `calendar ${member_name}`,
        type: "calendar",
      },
    ]),
  }).then((res) => res.json());

  await fetch(`${API_URL}/widget_listings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BOOKINGMOOD_API_KEY}` },
    body: JSON.stringify([
      { widget_id: widget.id, product_id: product.id, order: 0 },
    ]),
  });

  return NextResponse.json({
    member_id: member.id,
    product_id: product.id,
    widget_id: widget.id,
    embed_url: `https://www.bookingmood.com/embed/${widget.id}`,
  });
}
