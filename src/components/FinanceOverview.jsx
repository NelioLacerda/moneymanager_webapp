import {addThousandsSeparator} from "../util/util.js";
import CustomPieChart from "./CustomPieChart.jsx";
import {useTranslation} from "react-i18next";

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const { t } = useTranslation();

    const COLORS = ["#59168B", "#a0090e", "#016630"];

    const balanceData = [
        {name: "Total Balance", amount: totalBalance},
        {name: "Total Expenses", amount: totalExpense},
        {name: "Total Income", amount: totalIncome},
    ];

    return(
        <div className="card">
            <div className="flex justify-between items-center">
                <h5 className="text-lg">{t("home.financeOverview.title")}</h5>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="w-full max-w-[520px]">
                    <CustomPieChart
                        data={balanceData}
                        label={t("home.financeOverview.totalBalance")}
                        totalAmount={`$${addThousandsSeparator(totalBalance)}`}
                        colors={COLORS}
                        showTextAnchor={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default FinanceOverview;