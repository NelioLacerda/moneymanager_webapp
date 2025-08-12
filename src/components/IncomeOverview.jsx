import {useEffect, useState} from "react";
import {prepareIncomeLineChartData} from "../util/util.js";
import CustomLineChart from "./CustomLineChart.jsx";
import {Plus} from "lucide-react";

const IncomeOverview = ({transactions, onAddIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);
    }, [transactions])

    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <div>
                    <h5 className="text-lg">
                        Income Overview
                    </h5>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Track your incomes and expenses.
                    </p>
                </div>
                <button className="add-btn" onClick={onAddIncome}>
                    <Plus size={15} className="text-lg"/> Add Income
                </button>
                <div className="mt-10">
                    {/* create line chart */}
                    <CustomLineChart data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default IncomeOverview;