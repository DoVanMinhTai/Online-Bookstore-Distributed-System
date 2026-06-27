import { GetServerSideProps } from "next";
import Head from "next/head";
import BreadCrumb from "@/common/components/BreadCrumb";
import CategoryList from "@/modules/category/components/CategoryList";
import { getCategories } from "@/modules/category/services/CategoryService";
import { Category } from "@/modules/category/models/Category";
import CategorySidebar from "@/modules/category/components/CategorySidebar";

type Props = {
    categories: Category[];
    error?: string | null;
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const categories = await getCategories();
        return { props: { categories } };
    } catch {
        return { props: { categories: [], error: "Không tải được danh mục." } };
    }
};

const CategoriesPage = ({ categories, error }: Props) => {
    return (
        <div className="container mx-auto px-4 py-6">
            <Head>
                <title>Danh mục - BookShop</title>
            </Head>
            <BreadCrumb
                items={[
                    { pageName: "Home", url: "/" },
                    { pageName: "Danh mục", url: "/categories" },
                ]}
                className="mb-4"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 mt-6">
                <div className="hidden lg:block">
                    <CategorySidebar categories={categories} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Tất cả danh mục sách</h1>
                    <CategoryList categories={categories} error={error} />
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;

