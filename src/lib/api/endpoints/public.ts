type Id = string | number;

export const publicEndpoints = {
    posts: {
        list: "/api/public/posts",
        featured: "/api/public/posts/featured",
        showBySlug: (slug: string) => `/api/public/posts/${slug}`,
        comments: (postId: Id) => `/api/public/posts/${postId}/comments`,
    },
    postCategories: {
        list: "/api/public/post-categories",
        showBySlug: (slug: string) => `/api/public/post-categories/${slug}`,
    },
    postTags: {
        list: "/api/public/post-tags",
        showBySlug: (slug: string) => `/api/public/post-tags/${slug}`,
    },
    contacts: {
        create: "/api/public/contacts",
    },
    systemConfigs: {
        getByGroup: (group: string) => `/api/public/system-configs/${group}`,
        general: "/api/public/system-configs/general",
    },
    banners: {
        list: "/api/public/banners",
        show: (id: Id) => `/api/public/banners/${id}`,
        getByLocation: (locationCode: string) => `/api/public/banners/location/${locationCode}`,
    },
    homepage: "/api/public/homepage",
    projects: {
        list: "/api/projects",
        featured: "/api/projects/featured",
        showBySlug: (slug: string) => `/api/projects/${slug}`,
    },
    aboutSections: {
        list: "/api/about-sections",
        showBySlug: (slug: string) => `/api/about-sections/${slug}`,
        getByType: (type: string) => `/api/about-sections/type/${type}`,
    },
    staff: {
        list: "/api/staff",
        show: (id: Id) => `/api/staff/${id}`,
        getByDepartment: (department: string) => `/api/staff/department/${department}`,
    },
    testimonials: {
        list: "/api/testimonials",
        featured: "/api/testimonials/featured",
        getByProject: (projectId: Id) => `/api/testimonials/project/${projectId}`,
    },
    partners: {
        list: "/api/partners",
        getByType: (type: string) => `/api/partners/type/${type}`,
    },
    gallery: {
        list: "/api/gallery",
        featured: "/api/gallery/featured",
        showBySlug: (slug: string) => `/api/gallery/${slug}`,
    },
    certificates: {
        list: "/api/certificates",
        show: (id: Id) => `/api/certificates/${id}`,
        getByType: (type: string) => `/api/certificates/type/${type}`,
    },
    faqs: {
        list: "/api/faqs",
        popular: "/api/faqs/popular",
        show: (id: Id) => `/api/faqs/${id}`,
        markHelpful: (id: Id) => `/api/faqs/${id}/helpful`,
    },
    reviews: {
        comic: (comicId: Id) => `/api/public/reviews/comics/${comicId}`,
    },
    comments: {
        comic: (comicId: Id) => `/api/public/comic-comments/comics/${comicId}`,
        chapter: (chapterId: Id) => `/api/public/comic-comments/chapters/${chapterId}`,
    },
    comics: {
        list: "/api/public/comics",
        detail: (slug: string) => `/api/public/comics/${slug}`,
        chapters: (slug: string) => `/api/public/comics/${slug}/chapters`,
    },
    comicCategories: {
        list: "/api/public/comic-categories",
        show: (id: Id) => `/api/public/comic-categories/${id}`,
    },
    menus: {
        list: "/api/public/menus",
    },
    location: {
        countries: "/api/public/location/countries",
        provinces: "/api/public/location/provinces",
        wards: "/api/public/location/wards",
    },
} as const;


