import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readUserDataFile } from "@/app/utils/read-file";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //check if user exists
    const users = await readUserDataFile();

    const existingUser = users[email];

    const hashedPasswordCheck = await bcrypt.compare(
      password,
      existingUser?.password ?? ''
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: "user does not exists" },
        { status: 403 }
      );
    }

    //check if password is correct
    if (!hashedPasswordCheck) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 403 }
      );
    }

    //create token data
    const tokenData = {
      email: existingUser.email,
      password: existingUser.password,
    };
    //create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
