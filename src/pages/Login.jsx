import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { AppContext } from "../context/AppContext.jsx";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {validateEmail} from "../util/validation.js";
import axiosConfig from "../util/AxiosConfig.jsx";

const Login = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext);

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            setIsLoading(false);
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
        }

        //api call to login user
        try{
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email, password});

            const {token, user} = response.data;
            if (token) {
                console.log("Token:", token);
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else setError("An error occurred while logging in. Please try again.");
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/*Background image with blur*/}
            <img src={assets.login_background} alt="background" className="absolute inset-0 h-full w-full object-cover blur-sm"/>

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        {t("login.title")}
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        {t("login.subtitle")}
                    </p>

                    <form onSubmit={handleOnSubmit} className="space-y-4">
                        <Input
                            label={t("login.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeHolder={t("login.emailPlaceholder")}
                            type="text"
                            isSelect={false}
                        />

                        <Input
                            label={t("login.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeHolder="*********"
                            type="password"
                            isSelect={false}
                        />

                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button disabled={isLoading} className= {`btn-primary w-full py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed': ''}`} type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    {t("login.logging")}
                                </>
                            ) :
                                <>
                                    {t("login.loginText")}
                                </>
                            }
                        </button>


                        <p className="text-sm text-center text-slate-800 mt-6">
                            {t("login.dontHaveAccount")}
                            <Link to="/signup" className="font-medium text-primary underline hover::text-primary-dark transition-colors">{t("login.signup")}</Link>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login;