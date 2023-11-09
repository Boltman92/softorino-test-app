import path from "path";
import fsPromises from "fs/promises";
import { UserData } from "../interfaces";

export const dataFilePath = "./src/app/signup/api/userData.json";
export const projectFilePath = "/src/app/projects/api/projectsData.json";

export async function readUserDataFile() {
  const file = path.join(process.cwd(), dataFilePath);

  const jsonData = await fsPromises.readFile(file);
  const objectData: UserData = JSON.parse(jsonData.toString());

  return objectData;
}
