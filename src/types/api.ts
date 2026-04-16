import { AxiosError } from "axios";

// ===== API INFRASTRUCTURE TYPES =====

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

// ===== RE-EXPORTS (backward compatibility) =====
// Domain types đã được tách ra các file riêng.
// Import trực tiếp từ @/types/post, @/types/introduction, @/types/system khi viết code mới.

export type { Category, Tag, Post, PostComment, PostViewStats, PostStatisticsOverview } from "./post";
export type { Project, AboutSection, TeamMember, Partner, FAQ } from "./introduction";
export type { SystemConfig, ContactPayload, ContactResponse, ContentTemplate, Menu } from "./system";
