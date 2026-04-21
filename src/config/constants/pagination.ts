/**
 * Pagination constants — dùng chung cho toàn bộ ứng dụng.
 * Tránh hardcode page size trong từng file.
 */

/** Default page size cho các danh sách admin (ví dụ: quản lý categories, chapters) */
export const ADMIN_PAGE_SIZE = 20;

/** Default page size cho danh sách công khai (ví dụ: danh sách truyện, bài viết) */
export const PUBLIC_PAGE_SIZE = 9;

/** Default page size cho bình luận */
export const COMMENTS_PAGE_SIZE = 20;

/** Default page size chung (fallback) */
export const DEFAULT_PAGE_SIZE = 10;

/** Default limit cho bảng xếp hạng / thống kê */
export const STATS_TOP_LIMIT = 10;
