import { useMemo, useState, useEffect } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface ComicCommentFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ComicCommentFilter({
    initialFilters = {},
    onUpdateFilters,
}: ComicCommentFilterProps) {
    const [comics, setComics] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await api.get(adminEndpoints.comics.list, { params: { limit: 100 } });
                const data = response.data.data || response.data;
                if (Array.isArray(data)) {
                    setComics(data.map((comic: any) => ({
                        value: comic.id.toString(),
                        label: comic.title || comic.name,
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch comics for filter", error);
            }
        };
        fetchComics();
    }, []);


    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "visible", label: "Công khai" },
        { value: "hidden", label: "Đang ẩn" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Mới nhất" },
        { value: "created_at:asc", label: "Cũ nhất" },
    ];

    const comicOptions = [
        { value: "", label: "Tất cả truyện" },
        ...comics
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm nội dung, người gửi..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            advancedFilters={({ filters, onChange }) => (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48">
                        <SelectFilter
                            value={filters["status"] || ""}
                            options={statusOptions}
                            placeholder="Trạng thái"
                            onChange={(value) => {
                                filters["status"] = value;
                                onChange();
                            }}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <SelectFilter
                            value={filters["comic_id"] || ""}
                            options={comicOptions}
                            placeholder="Truyện tranh"
                            onChange={(value) => {
                                filters["comic_id"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
}


