import { z } from "zod";

/**
 * Reusable Zod field patterns.
 * Dùng trong các schema để tránh lặp validation rules.
 */

// ===== BASIC FIELDS =====

export const statusField = z.string().min(1, "Trạng thái là bắt buộc").default("active");
export const statusEnumField = z.enum(["active", "inactive"]).default("active");
export const sortOrderField = z.coerce.number().int().min(0, "Thứ tự không được âm").default(0);

export const nameField = (label: string, max = 255) =>
  z.string().min(1, `${label} là bắt buộc`).max(max, `${label} không được vượt quá ${max} ký tự`);

export const codeField = (label: string, max = 100) =>
  z.string().min(1, `${label} là bắt buộc`).max(max, `${label} tối đa ${max} ký tự`);

export const optionalText = (max = 500, label?: string) =>
  z.string().max(max, label ? `${label} tối đa ${max} ký tự` : `Tối đa ${max} ký tự`).optional().nullable();

export const optionalUrl = z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable();
export const optionalImage = z.string().optional().nullable();
export const requiredImage = (label = "Ảnh") => z.string().min(1, `${label} là bắt buộc`);

export const emailField = z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email quá dài");
export const passwordField = z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100, "Mật khẩu quá dài");

// ===== SEO META FIELDS =====

export const metaFields = {
  meta_title: z.string().max(255, "Meta Title tối đa 255 ký tự").optional().nullable(),
  meta_description: z.string().max(1000, "Meta Description tối đa 1000 ký tự").optional().nullable(),
  canonical_url: optionalUrl,
  og_image: optionalImage,
};

// ===== PASSWORD CONFIRM REFINEMENT =====

export const passwordConfirmRefinement = {
  validate: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"] as [string],
};
