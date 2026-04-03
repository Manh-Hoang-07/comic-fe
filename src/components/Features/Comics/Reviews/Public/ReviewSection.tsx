"use client";

import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { reviewService } from "@/lib/api/user/review";
import { useToastContext } from "@/contexts/ToastContext";
import { formatDate } from "@/utils/formatters";

interface ReviewSectionProps {
    comicId: string;
    reviews: any[];
    onReviewSuccess?: () => void;
}

export function ReviewSection({ comicId, reviews, onReviewSuccess }: ReviewSectionProps) {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToastContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await reviewService.submitReview(comicId, { rating, content });
            showSuccess("Cảm ơn bạn đã đánh giá!");
            setContent("");
            if (onReviewSuccess) onReviewSuccess();
        } catch (error) {
            showError("Bạn cần đăng nhập để đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-500" />
                Đánh giá từ bạn đọc
            </h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="bg-transparent border-none p-0"
                        >
                            {star <= rating ? (
                                <StarIcon className="w-8 h-8 text-yellow-500 cursor-pointer" />
                            ) : (
                                <StarOutline className="w-8 h-8 text-gray-300 cursor-pointer" />
                            )}
                        </button>
                    ))}
                    <span className="ml-2 text-sm font-bold text-gray-400 uppercase tracking-widest">{rating}/5 sao</span>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về bộ truyện này..."
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none h-24 text-sm"
                />
                <button
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition"
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </form>

            {/* List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            {review.user?.avatar ? (
                                <Image src={review.user.avatar} alt="" width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                    {review.user?.full_name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-gray-900 text-sm">{review.user?.full_name}</h4>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <StarIcon key={s} className={`w-3 h-3 ${s <= review.rating ? "text-yellow-500" : "text-gray-200"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 block">
                                {formatDate(review.created_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


