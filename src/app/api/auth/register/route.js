import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { name, email, password } = await request.json();
  await connect();
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
  }
  try {
    await newUser.save();
    const response = new NextResponse("User has been created", { status: 201 });
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  } catch (err) {
    const response = new NextResponse(err.message, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
};
