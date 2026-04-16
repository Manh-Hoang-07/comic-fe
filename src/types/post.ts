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
