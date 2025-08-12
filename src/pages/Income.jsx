import Dashboard from "../components/Dashboard.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import {Plus} from "lucide-react";
import AddIncomeFrom from "../components/AddIncomeFrom.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";
import {UserHook} from "../hooks/UserHook.jsx";

const Income = () => {
    UserHook();

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
            toast.error("Error fetching income data");
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
            toast.error("Error fetching income categories");
        }
    }

    const handleAddIncome = async (income) => {
        const {name, amount, categoryId, icon, date} = income;

        if (!name.trim() || !amount.trim() || !categoryId.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        if (Number(amount) <= 0 || isNaN(amount)) {
            toast.error("Please enter a valid amount");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error("Please select a valid date");
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
                toast.success("Income added successfully");
                setOpenAddIncomeModal(false);
                fetchIncomeData();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error("Error adding income");
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));

            toast.success("Income deleted successfully");
            setOpenDeleteAlert({show: false, data: null});
            fetchIncomeData();
        } catch (error) {
            console.error("Error deleting income:", error);
            toast.error("Error deleting income");
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
                    <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
                        <AddIncomeFrom onAddIncome={(income) =>handleAddIncome(income)} categories={categories}/>
                    </Modal>

                    {/* Delete income modal*/}
                    <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({show: false, data: null})} title="Delete Income" >
                        <DeleteAlert
                            content="Are you sure you want to delete this income?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;