import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import BreadCrumb from "@/common/components/BreadCrumb";
import CategoryBooks from "@/modules/category/components/CategoryBooks";
import { getBooksByCategory, getCategories } from "@/modules/category/services/CategoryService";
import { CategoryDetail } from "@/modules/category/models/CategoryDetail";
import { Category } from "@/modules/category/models/Category";
import CategorySidebar from "@/modules/category/components/CategorySidebar";

type Props = {
    category: CategoryDetail | null;
    categories: Category[];
    error?: string | null;
};

const PAGE_SIZE = 12;

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { slug } = context.query;
    try {
        const [category, categories] = await Promise.all([
            getBooksByCategory(slug as string, 0, PAGE_SIZE),
            getCategories(),
        ]);
        return { props: { category, categories } };
    } catch {
        let categories: Category[] = [];
        try {
            categories = await getCategories();
        } catch {}
        return { props: { category: null, categories, error: "Không tìm thấy danh mục." } };
    }
};

const CategoryDetailPage = ({ category, categories, error }: Props) => {
    const [data, setData] = useState<CategoryDetail | null>(category);
    const [isLoading, setIsLoading] = useState(false);

    if (error || !data) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <h1 className="text-xl font-semibold text-slate-700">
                    {error || "Không tìm thấy danh mục."}
                </h1>
            </div>
        );
    }

    const handlePageChange = async (pageNo: number) => {
        if (pageNo < 0) return;
        setIsLoading(true);
        try {
            const next = await getBooksByCategory(data.id, pageNo, PAGE_SIZE);
            setData(next);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            // keep current data on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <Head>
                <title>{data.name} - BookShop</title>
            </Head>
            <BreadCrumb
                items={[
                    { pageName: "Home", url: "/" },
                    { pageName: "Danh mục", url: "/categories" },
                    { pageName: data.name, url: `/categories/${data.id}` },
                ]}
                className="mb-4"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 mt-6">
                <div className="hidden lg:block">
                    <CategorySidebar categories={categories} activeCategoryId={data.id} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{data.name}</h1>
                    {data.description && (
                        <p className="mb-6 text-slate-500 text-sm">{data.description}</p>
                    )}
                    <CategoryBooks
                        books={data.books}
                        pageNo={data.pageNo}
                        totalPages={data.totalPages}
                        isLast={data.isLast}
                        isLoading={isLoading}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailPage;

