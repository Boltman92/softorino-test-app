import path from "path";
import fsPromises from "fs/promises";
import { NextResponse } from "../../../../node_modules/next/server";
import { NextApiResponse } from "next";
import { dataFilePath, readUserDataFile } from "@/app/utils/read-file";

export async function POST(request: Request, response: NextApiResponse) {
  try {
    const rawData = await request.json();
    const existingData = await readUserDataFile();
    if (existingData[rawData.email]) {
      return NextResponse.json(
        {},
        { status: 403, statusText: "user is already exists" }
      );
    }

    const newData = {
      ...existingData,
      [rawData.email]: {
        email: rawData.email,
        password: rawData.password,
        projects: [],
      },
    };

    const file = path.join(process.cwd(), dataFilePath);

    await fsPromises.writeFile(file, JSON.stringify(newData));

    return NextResponse.json(
      { data: "you successfully registered!" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { data: e.message },
      { status: 500, statusText: e.message }
    );
  }
}

export async function GET() {
  const response = await readUserDataFile();

  return NextResponse.json(response);
}
