import { redirect } from "next/navigation";
import { getComicCategories } from "@/lib/api/public/comic";
import { ComicCategory } from "@/types/comic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ComicCategoryRedirectPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    redirect('/comics');
  }

  try {
    // getComicCategories uses serverFetch which is safe here in a Server Component
    const categories = await getComicCategories();
    const category = categories.find((c: ComicCategory) => c.slug === slug);

    if (category) {
      redirect(`/comics?comic_category_id=${category.id}`);
    }
  } catch (err) {
    console.error("Redirect error in ComicCategoryRedirectPage:", err);
  }

  // Fallback to main comics list if category not found
  redirect('/comics');
}



