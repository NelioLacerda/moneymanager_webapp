import {BrowserRouter, Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {Routes, Route} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Income from "./pages/Income.jsx";
import Home from "./pages/Home.jsx";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";

const App = () => {
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

const Root = () => {
    const  isAuthenticated = !!localStorage.getItem("token");
    console.log("isAuthenticated:", isAuthenticated);
    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ): (
        <Navigate to="/login" />
    );
}

export default App;