import Dashboard from "../components/Dashboard.jsx";
import {UserHook} from "../hooks/UserHook.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/AxiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import AddExpenseFrom from "../components/AddExpenseFrom.jsx";
import {useTranslation} from "react-i18next";

const Expense = () => {
    UserHook();

    const { t } = useTranslation();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });

    const fetchExpenseData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Error fetching expense data:", error);
            toast.error(t("expense.page.errorData"));
        } finally {
            setLoading(false);
        }
    }

    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching expense categories:", error);
            toast.error(t("expense.page.errorCategories"));
        }
    }

    const handleAddExpense = async (expense) => {
        const {name, amount, categoryId, icon, date} = expense;

        if (!name.trim() || !amount.trim() || !categoryId.trim()) {
            toast.error(t("geral.fillAlFields"));
            return;
        }

        if (Number(amount) <= 0 || isNaN(amount)) {
            toast.error(t("geral.validAmount"));
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error(t("geral.validDate"));
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });
            if (response.status === 201) {
                toast.success(t("expense.page.addExpenseSuccess"));
                setOpenAddExpenseModal(false);
                fetchExpenseData();
                fetchExpenseCategories();
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error(t("expense.page.errorAdding"));
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

            toast.success(t("expense.page.deleteExpenseSuccess"));
            setOpenDeleteAlert({show: false, data: null});
            fetchExpenseData();
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast.error(t("expense.page.errorDeleting"));
        }
    }

    //nao feito
    const handleDownloadExpenseDetails =  () => {
        console.log("handleDownloadExpenseDetails");
    }

    //nao feito
    const handleEmailExpenseDetails = () => {
        console.log("handleEmailExpenseDetails");
    }

    useEffect(() => {
        fetchExpenseData();
        fetchExpenseCategories();
    }, [])
    
    return(
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* Overview for expense with line char*/}
                        <ExpenseOverview transactions={expenseData} onAddExpense={() => setOpenAddExpenseModal(true)}/>
                    </div>

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />

                    {/* Add expense modal*/}
                    <Modal isOpen={openAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title={t("expense.page.addExpense")}>
                        <AddExpenseFrom onAddExpense={(expense) =>handleAddExpense(expense)} categories={categories}/>
                    </Modal>

                    {/* Delete expense modal*/}
                    <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({show: false, data: null})} title={t("expense.page.deleteExpense")} >
                        <DeleteAlert
                            content={t("expense.page.deleteExpenseConfirmation")}
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Expense;