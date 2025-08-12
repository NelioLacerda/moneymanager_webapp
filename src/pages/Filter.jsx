import Dashboard from "../components/Dashboard.jsx";
import {UserHook} from "../hooks/UserHook.jsx";
import {useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";
import {Search} from "lucide-react";
import {useTranslation} from "react-i18next";

const Filter = () => {
    UserHook();

    const { t } = useTranslation();

    const [type, setType] = useState("income");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFilter = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const responde = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                type,
                startDate,
                endDate,
                keyword,
                sortField,
                sortOrder
            });
            setTransactions(responde.data);
            toast.success("Transactions filtered successfully");
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Error fetching transactions");
        } finally {
            setLoading(false);
        }
    }

    return(
        <Dashboard activeMenu="Filters">
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold ">{t("filter.title")}</h2>
                </div>
                <div className="card p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-semibold">{t("filter.desc")}</h5>
                    </div>
                    <form className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="type">{t("filter.type")}</label>
                            <select value={type} id="type" className="w-full border rounded px-3 py-2" onChange={(e) => setType(e.target.value)}>
                                <option value="income">{t("filter.income")}</option>
                                <option value="expense">{t("filter.expense")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="startdate">{t("filter.startDate")}</label>
                            <input value={startDate} type="date" id="startdate" className="w-full border rounded px-3 py-2" onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="enddate">{t("filter.endDate")}</label>
                            <input value={endDate} type="date" id="enddate" className="w-full border rounded px-3 py-2" onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="sortfield">{t("filter.sortField")}</label>
                            <select value={sortField} id="sortfield" className="w-full border rounded px-3 py-2" onChange={(e) => setSortField(e.target.value)}>
                                <option value="date">{t("filter.date")}</option>
                                <option value="amount">{t("filter.amount")}</option>
                                <option value="category">{t("filter.category")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="sortorder">{t("filter.sortOrder")}</label>
                            <select value={sortOrder} id="sortorder" className="w-full border rounded px-3 py-2" onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="asc">{t("filter.ascending")}</option>
                                <option value="desc">{t("filter.descending")}</option>
                            </select>
                        </div>
                        <div className="sm:col-span-1 md:col-span-1 flex items-end">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1" htmlFor="keyword">{t("filter.search")}</label>
                                <input value={keyword} type="text" placeholder={t("filter.placeholderSearch")} id="keyword" className="w-full border rounded px-3 py-2" onChange={(e) => setKeyword(e.target.value)}/>
                            </div>
                            <button onClick={handleFilter} className="ml-2 mb-1 p-2 bg-purple-800 hover:bg-purple-800 text-white rounded flex items-center justify-center cursor-pointer">
                                <Search size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-semibold">{t("filter.transactions")}</h5>
                    </div>
                    {transactions.length === 0 && !loading ? (
                        <p className="text-gray-500">{t("filter.transDesc")}</p>
                    ): ""}

                    {loading ? (
                        <p className="text-gray-500">{t("filter.loadTransactions")}</p>
                    ) : ("")}

                    {transactions.map((transaction) => (
                        <TransactionInfoCard
                            key={transaction.id}
                            title={transaction.name}
                            icon={transaction.icon}
                            date={moment(transaction.date).format("DD-MM-YYYY")}
                            amount={transaction.amount}
                            category={transaction.category}
                            type={type}
                            hideDeleteBtn={true}
                            description={transaction.description}
                        />
                    ))}
                </div>
            </div>
        </Dashboard>
    )
}

export default Filter;