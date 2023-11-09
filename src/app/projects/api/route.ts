import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fsPromises from "fs/promises";
import { projectFilePath, readProjectDataFile } from "@/app/utils/read-file";
import { ProjectData } from "@/app/interfaces";
import path from "path";

export async function GET(request: NextRequest) {
  const projectData = await readProjectDataFile();

  return NextResponse.json(projectData, { status: 200 });
}

export async function POST(request: NextRequest) {
  const projectData = await readProjectDataFile();

  const reqBody = (await request.json()) as ProjectData;

  const file = path.join(process.cwd(), projectFilePath);

  const notEmptyTasks = reqBody.tasks?.filter((task) => task !== "") ?? [];

  const existingProjectIndex = projectData.findIndex(
    (project) => reqBody.title === project.title
  );

  if (existingProjectIndex !== -1) {
    projectData[existingProjectIndex] = { ...reqBody, tasks: notEmptyTasks };


    await fsPromises.writeFile(file, JSON.stringify(projectData));

    return NextResponse.json(
      { data: "you successfully edit task!" },
      { status: 200 }
    );
  }

  projectData.push({
    title: reqBody.title,
    tasks: [...notEmptyTasks],
    comment: reqBody.comment,
  });


  await fsPromises.writeFile(file, JSON.stringify(projectData));

  return NextResponse.json(
    { data: "you successfully add new task!" },
    { status: 200 }
  );
}

export async function DELETE(request:NextRequest) {
  const projectData = await readProjectDataFile();

  const reqBody = (await request.json()) as ProjectData;

  const existingProjectIndex = projectData.findIndex(
    (project) => reqBody.title === project.title
  );

  projectData.splice(existingProjectIndex, 1)


await fsPromises.writeFile(projectFilePath, JSON.stringify(projectData));

  return NextResponse.json(
    { message: "you successfully deleted task", data: projectData },
    { status: 200 }
  );

}
