export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  cover_image: string | null;
  location: string;
  status: string;
  client_name: string;
  images: string | string[];
  featured: boolean;
}

export interface AboutSection {
  id: string;
  title: string;
  slug?: string;
  content: string;
  image: string | null;
  section_type?: string;
  status?: string;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  bio: string;
  avatar: string;
  email?: string;
  phone?: string;
  experience?: number;
  expertise?: string;
}

export interface Partner {
  id: string | number;
  name: string;
  logo: string;
  website: string;
  description: string;
  type: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
