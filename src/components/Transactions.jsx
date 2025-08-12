import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment/moment.js";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";

const Transactions = ({transactions, onMore, type, title}) => {
    const { t } = useTranslation();

    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h5 className="text-lg"> {title} </h5>
                <button className="hover:cursor-pointer group inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 transition-colors" onClick={onMore}>
                    {t("geral.viewAll")} <ArrowRight className="text-base" size={15}/>
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((transaction) => (
                    <TransactionInfoCard
                        key={transaction.id}
                        title={transaction.name}
                        icon={transaction.icon}
                        date={moment(transaction.date).format("DD-MM-YYYY")}
                        hideDeleteBtn={true}
                        amount={transaction.amount}
                        type={type}
                    />
                ))}
            </div>
        </div>
    )
}

export default Transactions