import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");
  if (user === null || user === "") {
    return NextResponse.json({ data: "no user provided" });
  }

  const response = await kv.set(`${user}`, true, { ex: 600 });
  console.log("response", response);

  return NextResponse.json({ data: response });
}
