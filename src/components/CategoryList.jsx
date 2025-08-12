import {Layers2, Pencil} from "lucide-react";
import {useTranslation} from "react-i18next";

const CategoryList = ({categories, onEditCategory}) => {
    const { t } = useTranslation();

    return(
        <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{t("category.list.title")}</h4>
            </div>

            {/* Category list*/}
            {categories.length === 0 ? (
                <p className="text-gray-500">{t("category.list.noCategories")}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-lg bg-gray-100 shadow-sm hover:bg-gray-200/80 hover:shadow-md hover:-translate-y-px transition-all duration-200 ease-out"
                        >
                            {/* Icon/Emoji Display */}
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img src={category.icon} alt="category icon" className="h-5 w-5"/>
                                    </span>
                                ) : (
                                    <Layers2 className="text-purple-800" size={24}/>
                                )}
                            </div>

                            {/* Category Details */}
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    {category.name}
                                </p>
                                <p className="text-sm font-medium text-gray-400 mt-1 capitalize">
                                    {category.type}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center ml-4">
                                <button
                                    onClick={() => onEditCategory(category)}
                                    className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 rounded"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CategoryList;