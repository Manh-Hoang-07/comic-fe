import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ProjectFilter } from "./ProjectFilter";

async function getProjects() {
  try {
    const { data, error } = await serverFetch(publicEndpoints.projects.list, {
      skipCookies: true,
      next: {
        revalidate: 300,
        tags: ['projects'],
      },
    });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectListAsync() {
  const projects = await getProjects();
  return <ProjectFilter initialProjects={projects} />;
}
