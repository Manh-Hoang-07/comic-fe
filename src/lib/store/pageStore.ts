import { create } from "zustand";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageState {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    setPageMeta: (data: { title: string; breadcrumbs?: BreadcrumbItem[] }) => void;
}

export const usePageStore = create<PageState>((set) => ({
    title: "",
    breadcrumbs: [],
    setPageMeta: ({ title, breadcrumbs = [] }) => set({ title, breadcrumbs }),
}));


