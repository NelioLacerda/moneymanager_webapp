import axios from "axios";
import {BASE_URL} from "./apiEndpoints.js";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

//list of endpoints taht do not require token (authorization)
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

//request interceptor
axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => {
        return config.url.includes(endpoint)
    });

    if (!shouldSkipToken) {
        const acessToken = localStorage.getItem("token");
        if (acessToken) {
            config.headers.Authorization = `Bearer ${acessToken}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

//response interceptor
axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response){
        if (error.response.status === 401) {
            window.location.href = "/login";
        } else if (error.response.status === 500) {
            console.error("Internal Server Error");
        }
    }else if(error.code === "ECONNABORTED"){
        console.error("Request timed out");
    }
    return Promise.reject(error);
});

export default axiosConfig;