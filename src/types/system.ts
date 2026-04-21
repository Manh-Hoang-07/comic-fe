export interface SystemConfig {
  site_name?: string;
  site_description?: string;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_copyright?: string | null;
  contact_channels?: Record<string, unknown>;
  timezone?: string;
  meta_title?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  [key: string]: unknown;
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
  metadata?: Record<string, unknown>;
  variables?: string[] | Record<string, unknown>;
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
