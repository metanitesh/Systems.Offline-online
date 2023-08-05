import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const users = searchParams.get("users");
  if (users === null || users === "") {
    return NextResponse.json({ data: "no users provided" });
  }

  console.log("users", users.split(","));
  const usersArray = users.split(",");
  const values = await kv.mget(...users.split(","));

  const response: any = {};

  usersArray.forEach((user, index) => {
    response[user] = values[index];
  });
  //   const response = values.map((value) => {
  //     if (value === null) {
  //       return false;
  //     }
  //     return value;
  //   });

  return NextResponse.json({ data: response });
}
