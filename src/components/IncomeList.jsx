import {Download, Mail} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => {
    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h5 className="text-lg">Income Sources</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="card-btn" onClick={onEmail}>
                        <Mail size={15} className="text-base" />Email
                    </button>
                    <button className="card-btn" onClick={onDownload}>
                        <Download size={15} className="text-base" />Download
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Display Incomes */}
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income.id}
                        icon={income.icon}
                        title={income.name}
                        date={moment(income.data).format("DD-MM-YYYY")}
                        amount={income.amount}
                        type="income"
                        onDelete = {() => onDelete(income.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList;