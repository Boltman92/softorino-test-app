"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../components/input-field";
import { FormValues } from "../interfaces";
import { useYupValidationResolver } from "../hooks/useYupResolver";
import { loginValidationSchema } from "../utils/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginValues = Omit<FormValues, "confirmPassword">;

export default function Login() {
  const resolver = useYupValidationResolver<LoginValues>(loginValidationSchema);
  const router = useRouter();
  const [backendError, setBackendError] = useState("");

  const onSubmit = async (data: LoginValues) => {
    try {
      const { email, password } = data;

      const response = await fetch("./login/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status !== 200) {
        setBackendError(response.statusText ?? "unknown error");
      } else {
        router.push("/projects");
      }
    } catch (e) {
      console.log(e, 'error')
      setBackendError("something went wrong...");
    }
  };

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginValues>({
    resolver,
    reValidateMode: "onSubmit",
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Please, login to continue</div>
      <form
        className="w-full h-48 flex flex-col flex-1 justify-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          name="email"
          description="Email:"
          register={register}
          isError={!!errors.email}
          errorMessage={errors.email?.message || backendError}
        />
        <InputField
          name="password"
          description="your password:"
          register={register}
          isError={!!errors.password || !!backendError}
          errorMessage={errors.password?.message || backendError}
          type="password"
        />
        <input type="submit" />
      </form>
      <div>do not have account yet?</div>
      <button onClick={() => router.push("/signup")}>sign up!</button>
    </main>
  );
}
