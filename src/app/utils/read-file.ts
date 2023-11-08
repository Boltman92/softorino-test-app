import path from "path";
import fsPromises from 'fs/promises';
import { ProjectData } from "../interfaces";

export const dataFilePath = './src/app/signup/api/userData.json';
export const projectFilePath = '/src/app/projects/api/projectsData.json';

interface UserData {
    email: string;
    password: string;
}


export  async function readUserDataFile() {
    const file = path.join(process.cwd(), dataFilePath);

    const jsonData = await fsPromises.readFile(file);
    const objectData = JSON.parse(jsonData.toString());

    return objectData as UserData[];
}

export  async function readProjectDataFile() {
    const file = path.join(process.cwd(), projectFilePath);

    const jsonData = await fsPromises.readFile(file);
    const objectData = JSON.parse(jsonData.toString());

    return objectData as ProjectData[];
}
