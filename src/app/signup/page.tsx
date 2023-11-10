"use client";
import { useForm } from "react-hook-form";
import { InputField } from "../components/input-field";
import { FormValues } from "../interfaces";
import { useYupValidationResolver } from "../hooks/useYupResolver";
import { signUpValidationSchema } from "../utils/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bcrypt from "bcryptjs";

export default function SignUp() {
  const resolver = useYupValidationResolver<FormValues>(signUpValidationSchema);
  const router = useRouter();
  const [backendErorr, setBackendError] = useState("");

  const onSubmit = async (data: FormValues) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = {
      email: data.email,
      password: hashedPassword,
    };

    const response = await fetch("./signup/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    if (response.status !== 200) {
      setBackendError(response.statusText);
    } else {
      router.push("/login");
    }
  };

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver,
    reValidateMode: "onSubmit",
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4">Create your account</h1>

      <form
        className="w-full h-48 flex flex-col flex-1 justify-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          name="email"
          description="Email:"
          register={register}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <InputField
          name="password"
          description="Set password:"
          register={register}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
          type="password"
        />
        <InputField
          name="confirmPassword"
          description="confirm password:"
          register={register}
          isError={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          type="password"
        />
        <input type="submit" />
        {!!backendErorr && (
          <div className="text-sm text-red-500 w-100vw flex justify-center mt-8">
            {backendErorr}
          </div>
        )}
      </form>
    </main>
  );
}
