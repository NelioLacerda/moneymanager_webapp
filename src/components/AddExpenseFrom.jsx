import {useEffect, useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";

const AddExpenseFrom = ({onAddExpense, categories}) => {

    const { t } = useTranslation();

    const [expense, setExpense] = useState({
        name: "",
        amount: "",
        categoryId: "",
        icon: "",
        date: "",
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name,
    }));

    const handleChange = (key, value) => {
        setExpense({
            ...expense,
            [key]: value,
        });
    }

    const handleAddExpense = async (expense) => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (categories.length > 0 && !expense.categoryId) {
            setExpense((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, expense.categoryId])

    return(
        <div>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={(target) => handleChange("name", target.value)}
                label={t("expense.form.name")}
                placeHolder={t("expense.form.placeholder")}
                type="text"
            />

            <Input
                value={expense.categoryId}
                onChange={(target) => handleChange("categoryId", target.value)}
                label={t("expense.form.category")}
                type="select"
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={(target) => handleChange("amount", target.value)}
                label={t("expense.form.amount")}
                placeHolder={t("expense.form.placeholderAmount")}
                type="number"
            />

            <Input
                value={expense.date}
                onChange={(target) => handleChange("date", target.value)}
                label={t("expense.form.date")}
                type="date"
                placeHolder=""
            />

            <div className="flex justify-end mt-6">
                <button onClick={() => handleAddExpense(expense)} disabled={loading} type="button" className="hover:cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px">
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            <>
                                {t("expense.form.adding")}
                            </>
                        </>
                    ) : (
                        <>
                            {t("expense.form.add")}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddExpenseFrom;