"use client";
import { useForm } from "react-hook-form";
import { InputField } from "../components/input-field";
import { FormValues } from "../interfaces";
import { useYupValidationResolver } from "../hooks/useYupResolver";
import { signUpValidationSchema } from "../utils/validation";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const resolver = useYupValidationResolver<FormValues>(signUpValidationSchema);
  const router = useRouter()

  const onSubmit = async (data: FormValues) => {

    const result = {
        email: data.email,
        password: data.password,
      };

    const response = await fetch("./signup/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    if (response.status !== 200) {
      alert(response.statusText);
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
      </form>
    </main>
  );
}
