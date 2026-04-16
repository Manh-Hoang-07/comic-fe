import { z } from "zod";
import { statusField, sortOrderField } from "./common";

export const faqSchema = z.object({
  question: z.string().min(1, "Câu hỏi là bắt buộc").max(500, "Câu hỏi không được vượt quá 500 ký tự"),
  answer: z.string().min(1, "Câu trả lời là bắt buộc").max(2000, "Câu trả lời không được vượt quá 2000 ký tự"),
  status: statusField,
  sort_order: sortOrderField,
});
export type FAQFormValues = z.infer<typeof faqSchema>;
