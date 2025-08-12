import {useEffect, useState} from "react";
import Input from "./Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";

const AddCategoryFrom = ({initialCategoryData, onAddCategory, isEditing}) => {
    const { t } = useTranslation();

    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory({
                name: initialCategoryData.name,
                type: initialCategoryData.type,
                icon: initialCategoryData.icon
            })
        } else {
            setCategory({
                name: "",
                type: "income",
                icon: ""
            })
        }
    }, [isEditing, initialCategoryData])

    const categoryTypeOptions = [
        {value: "income", label: t("category.form.income")},
        {value: "expense", label: t("category.form.expense")},
    ]

    const handleChange = (key, value) => {
        setCategory({
            ...category,
            [key]: value
        })
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);

        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label= {t("category.form.categoryName")}
                placeHolder={t("category.form.placeholder")}
                type="text"
            />

            <Input
                value={category.type}
                onChange={({target}) => handleChange("type", target.value)}
                label={t("category.form.categoryType")}
                type="select"
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-5">
                <button onClick={handleSubmit} disabled={loading} type="button" className=" hover:cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px">
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            {isEditing ? t("category.form.updating") : t("category.form.adding")}
                        </>
                    ) : (
                        <>
                            {isEditing ? t("category.form.update") : t("category.form.add") }
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryFrom;