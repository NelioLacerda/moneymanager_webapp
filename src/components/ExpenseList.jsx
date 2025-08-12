import {Download, Mail} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment/moment.js";
import {useTranslation} from "react-i18next";

const ExpenseList = ({transactions, onDelete, onDownload, onEmail}) => {
    const { t } = useTranslation();

    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h5 className="text-lg">{t("expense.list.title")}</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="cursor-pointer add-btn flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={onEmail}>
                        <Mail size={15} className="text-base" />{t("geral.email")}
                    </button>
                    <button className="cursor-pointer add-btn flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={onDownload}>
                        <Download size={15} className="text-base" />{t("geral.download")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Display Expenses */}
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense.id}
                        icon={expense.icon}
                        title={expense.name}
                        date={moment(expense.date).format("DD-MM-YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete = {() => onDelete(expense.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList;