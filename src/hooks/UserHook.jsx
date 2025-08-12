import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";

export const UserHook = () => {
    const {user, setUser, clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user){
            return;
        }

        let isMounted = true;

        const fetchUserInformation = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user information:", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        }

        fetchUserInformation();

        return () => {
            isMounted = false;
        }
    }, [setUser, clearUser, navigate])
}