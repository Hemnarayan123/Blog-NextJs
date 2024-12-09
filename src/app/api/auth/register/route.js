import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// List of allowed origins (change as needed)
const allowedOrigins = ["https://blog-portfolio-kappa.vercel.app"]; // Your Vercel frontend URL

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  // Establish database connection
  await connect();

  // Hash the password before saving to DB
  const hashedPassword = await bcrypt.hash(password, 5);

  // Create new user object
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Handle OPTIONS request for pre-flight check (CORS pre-flight)
  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", "*");  // Or use the allowedOrigins array here
    res.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
  }

  // Main POST request to register the user
  try {
    // Save the user to the database
    await newUser.save();

    // Create response
    const response = new NextResponse("User has been created", { status: 201 });
    response.headers.set("Access-Control-Allow-Origin", "*"); // You can replace "*" with specific origins

    return response;
  } catch (err) {
    // Error handling
    const response = new NextResponse(err.message, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*"); // Again, change "*" as needed
    return response;
  }
};
