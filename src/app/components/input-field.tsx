import React, { FC } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  description: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  isError: boolean;
  errorMessage?: string;
  type?: string;
}

export const InputField = <T extends object> ({
  description,
  name,
  register,
  isError,
  errorMessage = "invalid input",
  type = "text",
}: InputFieldProps<T>) => (
  <div className="w-full h-20 flex flex-col mb-2 items-center justify-center">
    <label className="my-1">{description}</label>
    <input className="w-72 h-7 rounded-xl" {...register(name)} type={type} />
    <div className="h-6 mt-1 text-xs text-red-500">{isError && <div>{errorMessage}</div>}</div>
  </div>
);
