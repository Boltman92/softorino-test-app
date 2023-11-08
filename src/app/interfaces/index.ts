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