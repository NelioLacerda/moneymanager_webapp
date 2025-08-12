import Dashboard from "../components/Dashboard.jsx";
import {Plus} from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryFrom from "../components/AddCategoryFrom.jsx";
import {UserHook} from "../hooks/UserHook.jsx";
import {useTranslation} from "react-i18next";

const Category = () => {
    UserHook();

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState("");
    const [openAddCategoryModel, setOpenAddCategoryModel] = useState(false);
    const [openEditCategoryModel, setOpenEditCategoryModel] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoryDetails = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log("Category data:", response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
            toast.error(t("category.page.errorData"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;

        if (!name.trim() || !type.trim()) {
            toast.error(t("geral.fillAlFields"));
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
            if (response.status === 201) {
                toast.success(t("category.page.successAdding"));
                setOpenAddCategoryModel(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error(t("category.page.errorAdding"));
        }
    }

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setOpenEditCategoryModel(true);
    }

    const handleUpdateCategory = async (category) => {
        const {id, name, type, icon} = category;
        if (!name.trim() || !type.trim()) {
            toast.error(t("geral.fillAlFields"));
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
            setOpenEditCategoryModel(false);
            setSelectedCategory(null);
            toast.success(t("category.page.successUpdating"));
            fetchCategoryDetails();
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error(t("category.page.errorUpdating"));
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/* Add category */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold ">{t("category.page.title")}</h2>
                    <button
                        onClick={() => setOpenAddCategoryModel(true)}
                        className="cursor-pointer add-btn flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        <Plus size={15}/>
                        {t("category.page.addCategory")}
                    </button>
                </div>
                {/* Category list*/}
                <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>

                {/* Category modal*/}
                <Modal isOpen={openAddCategoryModel} onClose={() => setOpenAddCategoryModel(false)} title={t("category.page.addCategory")} >
                    <AddCategoryFrom onAddCategory={handleAddCategory}/>
                </Modal>

                {/* update Category modal*/}
                <Modal isOpen={openEditCategoryModel}
                       onClose={() => {
                           setOpenEditCategoryModel(false);
                           setSelectedCategory(null)}
                       }
                       title={t("category.page.edit")} >
                    <AddCategoryFrom initialCategoryData={selectedCategory} onAddCategory={handleUpdateCategory} isEditing={true}/>
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category;