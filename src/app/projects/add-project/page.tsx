"use client";

import { InputField } from "@/app/components/input-field";
import { useYupValidationResolver } from "@/app/hooks/useYupResolver";
import { ProjectData } from "@/app/interfaces";
import { projectValidationSchema } from "@/app/utils/validation";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  title?: string;
  tasks?: string[];
  comment?: string;
}

export default function AddProject() {
  const router = useRouter();
  const resolver = useYupValidationResolver<Props>(projectValidationSchema);

  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "";
  const tasks = searchParams.get("tasks")
    ? JSON.parse(searchParams.get("tasks") ?? "")
    : [];
  const comment = searchParams.get("comment") ?? "";

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ProjectData>({
    resolver,
    reValidateMode: "onSubmit",
    defaultValues: {
      title,
      tasks,
      comment,
    },
  });

  const onSubmit = async ({ title, tasks, comment }: ProjectData) => {
    const response = await fetch("/projects/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, tasks, comment }),
    });

    const body = await response.json();

    if (response.status === 200) {
      alert(body.data);
      router.push("/projects");
    } else {
      alert("something went wrong...");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="title"
          register={register}
          description="project name"
          isError={!!errors.title}
          errorMessage={errors?.title?.message}
        />

        <InputField
          name="tasks.0"
          register={register}
          description="fist task"
          isError={false}
        />

        <InputField
          name="tasks.1"
          register={register}
          description="second task"
          isError={false}
        />

        <InputField
          name="tasks.2"
          register={register}
          description="third task"
          isError={false}
        />

        <input type="submit" className="w-full border border-black rounded" />
      </form>
    </main>
  );
}
