import {
  Banner,
  BestSellerList,
  FeturedProduct,
  FeaturedCategories,
  NewsletterSection,
} from "@/modules/homepage/components";

export default function Home() {
  return (
    <>
      {/* Hero banner + promo cards */}
      <Banner />

      {/* Danh mục nổi bật */}
      <FeaturedCategories />

      {/* Sản phẩm bán chạy */}
      <BestSellerList />

      {/* Sản phẩm nổi bật */}
      <FeturedProduct />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}
