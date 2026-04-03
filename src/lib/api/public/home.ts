import { serverFetch } from "@/lib/api/server-client";
import { Project, AboutSection, TeamMember, Partner, FAQ } from "@/types/api";
import { publicEndpoints } from "@/lib/api/endpoints";

export interface Certificate {
  id: string;
  name: string;
  image: string;
  issued_by: string;
  description: string;
  type: string;
}

export interface HomepageData {
  featured_projects: Project[];
  about_sections: AboutSection[];
  staff: TeamMember[];
  partners: Partner[];
  certificates: Certificate[];
  popular_faqs: FAQ[];
}

export const getHomepageData = async (): Promise<HomepageData | null> => {
  const { data } = await serverFetch<HomepageData>(publicEndpoints.homepage, {
    revalidate: 3600, // Cache 1 hour
    tags: ['homepage'],
    skipCookies: true // Cho phép trang chủ render tĩnh (ISR)
  });
  return data;
};


