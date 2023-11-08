import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { readUserDataFile } from "@/app/utils/read-file";

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json()
        const {email, password} = reqBody;

        //check if user exists
        const users = await readUserDataFile();
       const existingUser = users.find(user => user.email === email);

       if(!existingUser){
        return NextResponse.json({error: 'user does not exists'}, {status: 400})
       }
        
        
        //check if password is correct
        if(password !== existingUser.password){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        
        //create token data
        const tokenData = {
            email: existingUser.email,
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}