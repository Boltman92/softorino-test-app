import path from "path";
import fsPromises from 'fs/promises';
import { NextResponse } from "../../../../node_modules/next/server";
import { NextApiResponse } from "next";
import { dataFilePath, readUserDataFile } from "@/app/utils/read-file";


export async function POST(request: Request, response: NextApiResponse) {
    const rawData = await request.json();
    const existingData = await readUserDataFile();
    if(existingData.find((el: any) => el.email === rawData.email)){
      
       return NextResponse.json({}, {status: 403, statusText: 'user is already exists'})
     
    }

    existingData.push({email: rawData.email, password: rawData.password})
   
    await fsPromises.writeFile(dataFilePath, JSON.stringify(existingData))



    return NextResponse.json({data: 'you successfully registered!'}, {status: 200})
}

export async function GET(){
 const response = await readUserDataFile();

   return NextResponse.json(response);
}
