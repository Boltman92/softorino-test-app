export interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProjectData {
  title: string;
  tasks?: string[];
  comment?: string;
}

export interface User {
  email: string;
  password: string;
  projects: ProjectData[];
}

export type UserData = Record<string, User>;
