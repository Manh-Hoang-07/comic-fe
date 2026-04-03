import { useMemo, useState, useEffect } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface PostCommentsFilterProps {
    initialFilters: any;
    onUpdateFilters: (filters: any) => void;
}

export default function PostCommentsFilter({
    initialFilters,
    onUpdateFilters,
}: PostCommentsFilterProps) {
    const [posts, setPosts] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch a reasonable number of recent posts for the filter, or all if feasible.
                // Assuming standard pagination, we might want to fetch a larger page or search.
                // For now, simple fetch.
                const response = await api.get(adminEndpoints.posts.list, { params: { limit: 100 } });
                const data = response.data.data || response.data;
                if (Array.isArray(data)) {
                    setPosts(data.map((post: any) => ({
                        value: post.id.toString(),
                        label: post.name || post.title,
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch posts for filter", error);
            }
        };
        fetchPosts();
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

    const postOptions = [
        { value: "", label: "Tất cả bài viết" },
        ...posts
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm nội dung, người gửi..."
            onUpdateFilters={onUpdateFilters}
            hasAdvancedFilters={true}
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
                            value={filters["post_id"] || ""}
                            options={postOptions}
                            placeholder="Bài viết"
                            onChange={(value) => {
                                filters["post_id"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
}


