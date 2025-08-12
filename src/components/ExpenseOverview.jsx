import {useEffect, useState} from "react";
import {prepareLineChartData} from "../util/util.js";
import {Plus} from "lucide-react";
import CustomLineChart from "./CustomLineChart.jsx";
import {useTranslation} from "react-i18next";

const ExpenseOverview = ({transactions, onAddExpense}) => {
    const { t } = useTranslation();

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareLineChartData(transactions, {
            interval: 'daily',
            valueBy: 'expense',
            includeExpenses: false
        });
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card p-6">
            {/* grid: left column narrow, right column flexible */}
            <div className="grid grid-cols-12 gap-6 items-start">
                {/* left column */}
                <div className="col-span-12 md:col-span-3 flex md:block items-center md:items-start gap-4">
                    <div>
                        <h5 className="text-xl font-semibold">{t("expense.overview.title")}</h5>
                        <p className="text-sm text-gray-400 mt-1">
                            {t("expense.overview.desc")}
                        </p>
                    </div>

                    {/* Add button (small on mobile, stacked on desktop) */}
                    <button
                        className="ml-4 md:ml-0 md:mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer"
                        onClick={onAddExpense}
                    >
                        <Plus size={15} /> {t("expense.overview.add")}
                    </button>
                </div>

                {/* right column: chart */}
                <div className="col-span-12 md:col-span-9">
                    <div className="w-full h-[260px]">
                        {/* force height and let chart be responsive */}
                        <CustomLineChart data={chartData} height={260} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseOverview;