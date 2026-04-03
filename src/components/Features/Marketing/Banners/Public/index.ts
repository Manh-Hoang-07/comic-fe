// Export all banner components
export { default as HeroBanner } from "./HeroBanner";
export { default as BannerSlider } from "./BannerSlider";
export { default as SimpleBanner } from "./SimpleBanner";
export { default as BannerGrid } from "./BannerGrid";
export { default as SidebarBanner } from "./SidebarBanner";

// Export types
export interface HeroBannerData {
    id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    button_text?: string;
    link?: string;
    link_target?: string;
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
}


