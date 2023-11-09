"use client";
import { useEffect, useState } from "react";
import { ProjectData } from "../interfaces";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch("./projects/api");
      const result: ProjectData[] = await response.json();
      setProjects(result);
      setIsLoading(false);
    })();
  }, []);

  const handleEdit = (project: ProjectData) =>
    router.push(
      `/projects/add-project?title=${project.title}&tasks=${JSON.stringify(
        project.tasks
      )}&comment=${project.comment}`
    );

  const handleDelete = async (project: ProjectData) => {
    const response = await fetch("./projects/api", {
      method: "DELETE",
      body: JSON.stringify(project),
    });
    const result = await response.json();
    if (response.status === 200) {
      alert(result.message);
      setProjects(result.data);
    }
  };

  const handleLogout = async () => {
    const response = await fetch("./logout");
    const result = await response.json();
    if (response.status === 200) {
      alert(result.message);
      router.push("/login");
    }
  };

  return (
    <div className="w-full h-full flex justify-center px-8 items-center flex-col gap-4 sm:p-0">
      <button className="absolute right-6 top-6" onClick={handleLogout}>
        Logout
      </button>
      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <>
          {projects.map((project) => {
            return (
              <div
                key={`${project.title} + ${project?.tasks?.[0]}`}
                className="border border-black rounded text-xl p-4 w-full  sm:w-1/3 md:w-1/4 sm:m-0"
              >
                <div className="flex flex-row justify-between w-full gap-5">
                  <p className="max-w-xl"> {project.title} </p>
                  <div className="flex items-center h-7 gap-1">
                    <button onClick={() => handleEdit(project)}>
                      <Image src="edit.svg" alt="edit" width={24} height={24} />
                    </button>
                    <button onClick={async () => await handleDelete(project)}>
                      <Image
                        src="close.svg"
                        alt="edit"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div>
                <ul className="list-disc ml-6">
                  {project?.tasks?.map((task, index) => (
                    <li key={`${task} + ${index}`} className="text-sm">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <button onClick={() => router.push("/projects/add-project")}>
            add task
          </button>
        </>
      )}
    </div>
  );
}
