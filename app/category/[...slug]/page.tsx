import { CategoryPageClient } from "./category-page-client"

interface CategoryPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  return <CategoryPageClient slugParts={slug} />
}
