import Dashboard from "../components/Dashboard.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import AddIncomeFrom from "../components/AddIncomeFrom.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";
import {UserHook} from "../hooks/UserHook.jsx";
import {useTranslation} from "react-i18next";

const Income = () => {
    UserHook();

    const { t } = useTranslation();

    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });

    const fetchIncomeData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
            toast.error(t("income.page.errorData"));
        } finally {
            setLoading(false);
        }
    }

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching income categories:", error);
            toast.error(t("income.page.errorCategories"));
        }
    }

    const handleAddIncome = async (income) => {
        const {name, amount, categoryId, icon, date} = income;

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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });
            if (response.status === 201) {
                toast.success(t("income.page.addIncomeSuccess"));
                setOpenAddIncomeModal(false);
                fetchIncomeData();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error(t("income.page.errorAdding"));
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));

            toast.success(t("income.page.deleteIncomeSuccess"));
            setOpenDeleteAlert({show: false, data: null});
            fetchIncomeData();
        } catch (error) {
            console.error("Error deleting income:", error);
            toast.error(t("income.page.errorDeleting"));
        }
    }

    //nao feito
    const handleDownloadIncomeDetails =  () => {
        console.log("handleDownloadIncomeDetails");
    }

    //nao feito
    const handleEmailIncomeDetails = () => {
        console.log("Emailing income details...");
    }

    useEffect(() => {
        fetchIncomeData();
        fetchIncomeCategories();
    }, [])

    return(
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* Overview for income with line char*/}
                        <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)}/>
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />

                    {/* Add income modal*/}
                    <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title={t("income.page.addIncome")}>
                        <AddIncomeFrom onAddIncome={(income) =>handleAddIncome(income)} categories={categories}/>
                    </Modal>

                    {/* Delete income modal*/}
                    <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({show: false, data: null})} title={t("income.page.deleteIncome")} >
                        <DeleteAlert
                            content={t("income.page.deleteIncomeConfirmation")}
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;