import Dashboard from "../components/Dashboard.jsx";
import {UserHook} from "../hooks/UserHook.jsx";

const Expense = () => {
    UserHook();
    return(
        <Dashboard activeMenu="Expense">
            This is Expense page
        </Dashboard>
    )
}

export default Expense;