import { NextRequest, NextResponse } from "next/server";
import fsPromises from "fs/promises";
import {
  dataFilePath,
  readUserDataFile,
} from "@/app/utils/read-file";
import { ProjectData } from "@/app/interfaces";
import path from "path";
import { getEmail } from "@/app/utils/getEmail";

export async function GET() {
  const userData = await readUserDataFile();

  const email = getEmail();

  const userInfo = userData[email];

  if (!userInfo) {
    return NextResponse.json(
      { message: "user does not log in" },
      { status: 403 }
    );
  }

  return NextResponse.json(userInfo.projects, { status: 200 });
}

export async function POST(request: NextRequest) {
  const userData = await readUserDataFile();

  const reqBody: ProjectData = await request.json();

  const file = path.join(process.cwd(), dataFilePath);

  const notEmptyTasks = reqBody.tasks?.filter((task) => task !== "") ?? [];

  const email = getEmail();

  const userInfo = userData[email];

  const existingProjectIndex = userInfo.projects.findIndex(
    (project) => reqBody.title === project.title
  );

  if (existingProjectIndex !== -1) {
    userInfo.projects[existingProjectIndex] = {
      ...reqBody,
      tasks: notEmptyTasks,
    };

    await fsPromises.writeFile(
      file,
      JSON.stringify({ ...userData, [email]: { ...userInfo } })
    );

    return NextResponse.json(
      { data: "you successfully edit task!" },
      { status: 200 }
    );
  }

  userInfo.projects.push({
    title: reqBody.title,
    tasks: [...notEmptyTasks],
    comment: reqBody.comment,
  });

  await fsPromises.writeFile(
    file,
    JSON.stringify({ ...userData, [email]: userInfo })
  );

  return NextResponse.json(
    { data: "you successfully add new task!" },
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest) {
  const userData = await readUserDataFile();

  const reqBody: ProjectData = await request.json();

  const file = path.join(process.cwd(), dataFilePath);

  const email = getEmail();

  const userInfo = userData[email];

  const existingProjectIndex = userInfo.projects.findIndex(
    (project) => reqBody.title === project.title
  );

  const updatedProjectsArray = userInfo.projects.splice(
    existingProjectIndex,
    1
  );

  const newUserData = {
    ...userData,
    [email]: { ...userInfo, projects: updatedProjectsArray },
  };

  await fsPromises.writeFile(file, JSON.stringify(newUserData));

  return NextResponse.json(
    { message: "you successfully deleted task" },
    { status: 200 }
  );
}
