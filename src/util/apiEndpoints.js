export const BASE_URL = "http://localhost:8080/api";

export const CLOUDINARY_CLOUD_NAME = "drdtbjaql";


export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    GET_ALL_INCOME: "/incomes",
    CATEGORY_BY_TYPE: (type) => `/category/${type}`,
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DOWNLOAD: "/excel/download/income",
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
}