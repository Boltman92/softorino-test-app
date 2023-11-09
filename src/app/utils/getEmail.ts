import { cookies } from "next/headers";

export const getEmail = () => {
  const cookie = cookies();

  const token: any = cookie.get("token") ?? "";

  // @ts-ignore
  const cookiesInfo = atob(token.value.split(".")[1]);
  const email: string = JSON.parse(cookiesInfo).email;

  return email;
};
