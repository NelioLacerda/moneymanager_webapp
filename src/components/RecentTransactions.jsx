import {ArrowRight} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const RecentTransactions = ({transactions, onMore}) => {
    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h4 className="text-lg">Recent Transactions</h4>
                <button className="card-btn" onClick={onMore}>
                    View All <ArrowRight className="text-base" size={15}/>
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
                        type={transaction.type}
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions;