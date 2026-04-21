import { z } from "zod";
import { nameField, statusField, sortOrderField } from "@/config/validations/common";

export const faqSchema = z.object({
  question: nameField("Câu hỏi", 500),
  answer: z.string().min(1, "Câu trả lời là bắt buộc").max(2000, "Câu trả lời không được vượt quá 2000 ký tự"),
  status: statusField,
  sort_order: sortOrderField,
});

export type FAQFormValues = z.infer<typeof faqSchema>;
