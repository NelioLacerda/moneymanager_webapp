import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import {useTranslation} from "react-i18next";
import {validateEmail} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import uploadProfileImage from "../util/uploadProfileImage.js";
import {LoaderCircle} from "lucide-react";

const Signup = () => {
    const { t } = useTranslation();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form..." + userName);
        let profileImageUrl = "";

        setIsLoading(true);

        if (!userName.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        setError("");

        //api call to register user
        try{

            if (profilePhoto) {
                profileImageUrl = await uploadProfileImage(profilePhoto);
            }

            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER,
                {userName, email, password, profileImageUrl})
            if (response.status === 201) {
                toast.success("User registered successfully!");
                navigate("/login");
            } else {
                setError("An error occurred while registering. Please try again.");
            }
            console.log(
                "User registered successfully:",
                response.data
            )
        } catch (error) {
            console.error("Error registering user:", error);
            setError("An error occurred while registering. Please try again.");
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
                        {t("signup.title")}
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        {t("signup.subtitle")}
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex justify-center mb-6">
                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto}/>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input
                                label={t("signup.fullName")}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeHolder={t("signup.fullNamePlaceholder")}
                                type="text"
                                isSelect={false}
                            />

                            <Input
                                label={t("signup.email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeHolder={t("signup.emailPlaceholder")}
                                type="text"
                                isSelect={false}
                            />

                            <div className="col-span-3">
                                <Input
                                    label={t("signup.password")}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeHolder="*********"
                                    type="password"
                                    isSelect={false}
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button disabled={isLoading} className= {`btn-primary w-full py-3 text-lg font-medium bg-purple-800 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed': ''}`} type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    {t("signup.signingUp")}
                                </>
                            ) :
                                <>
                                {t("signup.signUp")}
                                </>
                            }
                        </button>


                        <p className="text-sm text-center text-slate-800 mt-6">
                            {t("signup.alreadyHaveAccount")}
                            <Link to="/login" className="font-medium text-primary underline hover::text-primary-dark transition-colors">{t("signup.login")}</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;