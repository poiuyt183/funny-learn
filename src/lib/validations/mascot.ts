import { z } from "zod";

export const mascotSchema = z.object({
    name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    type: z.string().min(2, { message: "Loại linh thú không được để trống" }),
    description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
    imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ" }),
    basePersonality: z.string().min(2, { message: "Tính cách không được để trống" }),
    baseGreeting: z.string().min(5, { message: "Câu chào phải có ít nhất 5 ký tự" }),
    traits: z.string().min(1, { message: "Phải có ít nhất 1 đặc điểm" }),
});

export type MascotInput = z.infer<typeof mascotSchema>;
