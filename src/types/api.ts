import { AxiosError } from "axios";

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

export interface SystemConfig {
  site_name?: string;
  site_description?: string;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_copyright?: string | null;
  contact_channels?: any;
  timezone?: string;
  meta_title?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  [key: string]: any;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface RetryConfig {
  delay: number;
  attempts: number;
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface EnhancedError extends AxiosError {
  method?: string;
  url?: string;
  timestamp?: string;
  userMessage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  description?: string;
  content: string;
  cover_image: string | null;
  image?: string | null;
  published_at?: string;
  view_count: number | string;
  primary_category?: Category;
  categories?: Category[];
  tags?: Tag[];
  created_at?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id?: string | null;
  guest_name?: string | null;
  guest_email?: string | null;
  parent_id?: string | null;
  content: string;
  status: 'visible' | 'hidden';
  created_at: string;
  post?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
  };
  replies?: PostComment[];
}

export interface PostViewStats {
  id: string;
  post_id: string;
  view_date: string;
  view_count: number;
  updated_at: string;
}

export interface PostStatisticsOverview {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  scheduled_posts: number;
  total_comments: number;
  pending_comments: number;
  total_views_last_30_days: number;
  top_viewed_posts: {
    id: string;
    name: string;
    slug: string;
    view_count: string;
    published_at?: string;
  }[];
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  code: string;
  name: string;
  category: 'render' | 'file';
  type: 'email' | 'telegram' | 'zalo' | 'sms' | 'pdf_generated' | 'file_word' | 'file_excel' | 'file_pdf' | string;
  content?: string;
  file_path?: string;
  metadata?: Record<string, any>;
  variables?: string[] | Record<string, any>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface Menu {
  id: number;
  code: string;
  name: string;
  path: string;
  icon: string;
  type: 'route' | 'group';
  children: Menu[];
}



