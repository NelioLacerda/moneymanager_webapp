import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment/moment.js";
import {ArrowRight} from "lucide-react";

const Transactions = ({transactions, onMore, type, title}) => {
    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h5 className="text-lg"> {title} </h5>
                <button className="card-btn" onClick={onMore}>
                    View All <ArrowRight className="text-base" size={15}/>/
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