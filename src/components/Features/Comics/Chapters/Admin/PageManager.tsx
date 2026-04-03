"use client";

import { useState, useEffect } from "react";
import { adminComicService } from "@/lib/api/admin/comic";
import { AdminChapter, AdminChapterPage } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import Image from "next/image";

interface PageManagerProps {
    chapter: AdminChapter;
    onClose: () => void;
}

export default function PageManager({ chapter, onClose }: PageManagerProps) {
    const [pages, setPages] = useState<AdminChapterPage[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { showSuccess, showError } = useToastContext();

    useEffect(() => {
        fetchPages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapter.id]);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const response = await adminComicService.getChapter(chapter.id);
            // Handle possibility of wrapped response: { data: { pages: [...] } } or { pages: [...] }
            const chapterData = (response as any).data || response;
            const sortedPages = (chapterData.pages || []).sort((a: any, b: any) => a.page_number - b.page_number);
            setPages(sortedPages);
            setSelectedIds([]); // Reset selection on refresh
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải danh sách trang");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (files.length > 100) {
            showError("Chỉ được upload tối đa 100 trang mỗi lần");
            return;
        }

        setUploading(true);
        try {
            await adminComicService.uploadPages(chapter.id, files);
            showSuccess(`Đã tải lên ${files.length} trang thành công`);
            fetchPages();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi tải ảnh lên");
        } finally {
            setUploading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === pages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pages.map(p => p.id));
        }
    };

    const toggleSelectPage = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const syncPagesToApi = async (updatedPages: AdminChapterPage[]) => {
        const reindexedPages = updatedPages.map((p, index) => ({
            ...p,
            page_number: index + 1,
        }));

        try {
            await adminComicService.updatePages(chapter.id, reindexedPages);
            setPages(reindexedPages);
            return true;
        } catch (error: any) {
            showError("Không thể đồng bộ thay đổi về server");
            return false;
        }
    };

    const handleDeleteBatch = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Xác nhận xóa ${selectedIds.length} trang đã chọn?`)) return;

        const remainingPages = pages.filter((p) => !selectedIds.includes(p.id));
        if (await syncPagesToApi(remainingPages)) {
            showSuccess(`Đã xóa ${selectedIds.length} trang`);
            setSelectedIds([]);
        }
    };

    const handleDeleteSingle = async (id: number, pageNumber: number) => {
        if (!confirm(`Xác nhận xóa trang ${pageNumber}?`)) return;

        const remainingPages = pages.filter((p) => p.id !== id);
        if (await syncPagesToApi(remainingPages)) {
            showSuccess("Đã xóa trang");
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    // Drag and Drop Logic
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedPages = [...pages];
        const draggedItem = updatedPages[draggedIndex];

        // Remove and re-insert
        updatedPages.splice(draggedIndex, 1);
        updatedPages.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setPages(updatedPages);
    };

    const handleDragEnd = async () => {
        if (draggedIndex !== null) {
            await syncPagesToApi(pages);
            showSuccess("Đã cập nhật thứ tự trang");
        }
        setDraggedIndex(null);
    };

    const movePage = async (currentIndex: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= pages.length) return;

        const updatedPages = [...pages];
        const temp = updatedPages[currentIndex];
        updatedPages[currentIndex] = updatedPages[newIndex];
        updatedPages[newIndex] = temp;

        setPages(updatedPages);
        const success = await syncPagesToApi(updatedPages);
        if (success) {
            showSuccess("Đã chuyển vị trí trang");
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900">Quản lý nội dung chương</h4>
                    <p className="text-xs text-gray-500 font-medium italic">
                        Dùng biểu tượng ⠿ để kéo thả hoặc ◀ ▶ để sắp xếp nhanh
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {pages.length > 0 && (
                        <button
                            onClick={toggleSelectAll}
                            className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            {selectedIds.length === pages.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </button>
                    )}
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleDeleteBatch}
                            className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-bold text-red-600 hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa {selectedIds.length} trang
                        </button>
                    )}
                </div>
            </div>

            {/* Upload Zone */}
            <div className="mb-4">
                <label className="group relative block cursor-pointer">
                    <div className="border-4 border-dashed border-gray-100 rounded-2xl p-6 text-center transition-all group-hover:border-blue-500/50 group-hover:bg-blue-50/30">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                        {uploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs font-bold text-blue-600 italic">Đang tải ảnh lên...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="mx-auto h-10 w-10 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase">Kéo thả để tải lên đồng loạt</h3>
                            </div>
                        )}
                    </div>
                </label>
            </div>

            {/* Pages Display */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4">
                    {pages.map((page, index) => {
                        const isSelected = selectedIds.includes(page.id);
                        const isDragging = draggedIndex === index;

                        return (
                            <div
                                key={page.id}
                                className={`relative flex flex-col gap-2 ${isDragging ? "opacity-30" : "opacity-100"}`}
                            >
                                <div
                                    className={`aspect-[3/4] relative bg-white rounded-xl overflow-hidden shadow-sm ring-2 transition-all duration-300 ${isSelected ? "ring-blue-500 scale-[0.98]" : "ring-transparent ring-offset-2 hover:ring-blue-200"
                                        }`}
                                >
                                    <Image
                                        src={page.image_url}
                                        alt={`Page ${page.page_number}`}
                                        fill className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />

                                    {/* SELECTION Area (Top Left) */}
                                    <button
                                        onClick={() => toggleSelectPage(page.id)}
                                        className={`absolute top-2 left-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all z-20 ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white/80 border-gray-300 text-transparent"
                                            }`}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>

                                    {/* DRAG HANDLE (Top Right) */}
                                    <div
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className="absolute top-2 right-2 h-8 w-8 bg-black/60 backdrop-blur-sm text-white rounded-lg flex items-center justify-center cursor-move z-20 hover:bg-blue-600 transition-colors"
                                        title="Kéo để sắp xếp"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                        </svg>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                        <p className="text-white text-[10px] font-bold text-center">T {page.page_number}</p>
                                    </div>
                                </div>

                                {/* QUICK MOVE ACTIONS (ALWAYS VISIBLE) */}
                                <div className="flex items-center justify-between gap-1 mt-1">
                                    <div className="flex gap-1 flex-1">
                                        <button
                                            onClick={() => movePage(index, 'up')}
                                            disabled={index === 0}
                                            className="flex-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 py-1.5 rounded-lg flex justify-center disabled:opacity-20 transition-colors"
                                            title="Lên trên"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => movePage(index, 'down')}
                                            disabled={index === pages.length - 1}
                                            className="flex-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 py-1.5 rounded-lg flex justify-center disabled:opacity-20 transition-colors"
                                            title="Xuống dưới"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSingle(page.id, page.page_number)}
                                        className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-1.5 rounded-lg transition-all"
                                        title="Xóa nhanh"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && pages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                    <svg
                        className="w-12 h-12 mb-3 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-xs font-bold uppercase tracking-widest italic">Chương này chưa có nội dung</p>
                </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    onClick={onClose}
                    className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    Hoàn tất & Đóng
                </button>
            </div>
        </div>
    );
}


