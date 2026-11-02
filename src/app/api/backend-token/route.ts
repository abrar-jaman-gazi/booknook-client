
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function POST() {
  try {
    // Verify the current Better Auth session.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in first.",
        },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing.");
    }

    // Generate a JWT using the authenticated user's identity.
    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Backend token generated successfully.",
        token,
        expiresIn: 3600,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Backend token generation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate backend token.",
      },
      { status: 500 }
    );
  }
}
