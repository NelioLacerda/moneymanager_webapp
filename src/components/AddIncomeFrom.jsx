import {useEffect, useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import {LoaderCircle} from "lucide-react";

const AddIncomeFrom = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
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
        setIncome({
            ...income,
            [key]: value,
        });
    }

    const handleAddIncome = async (income) => {
        setLoading(true);
        try {
            await onAddIncome(income);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (categories.length > 0 && !income.categoryId) {
            setIncome((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, income.categoryId])

    return(
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={(target) => handleChange("name", target.value)}
                label="Income Source*"
                placeHolder="e.g. Salary, Bonus, etc."
                type="text"
            />

            <Input
                value={income.categoryId}
                onChange={(target) => handleChange("categoryId", target.value)}
                label="Category*"
                type="select"
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={income.amount}
                onChange={(target) => handleChange("amount", target.value)}
                label="Amount*"
                placeHolder="e.g. 10000"
                type="number"
            />

            <Input
                value={income.date}
                onChange={(target) => handleChange("date", target.value)}
                label="Date"
                type="date"
                placeHolder=""
            />

            <div className="flex justify-end mt-6">
                <button onClick={() => handleAddIncome(income)} disabled={loading} type="button" className="add-btn add-btn-fill">
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            "Adding..."
                        </>
                    ) : (
                        <>
                            Add Income
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddIncomeFrom;