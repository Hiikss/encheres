import axiosInstance from '../AxiosInstance';
import { Category } from '../../types/Category';

export const getCategories = async () => {
    return axiosInstance
        .get<Category[]>(`/categories`)
        .then((res) => {
            return res;
        });
};

export const createCategory = async (category: Category) => {
    return axiosInstance
        .post(`/categories`, category)
        .then((res) => {
            return res;
        });
};

export const updateCategory = async (label: string, category: Category) => {
    return axiosInstance
        .put(`/categories/${label}`, category)
        .then((res) => {
            return res;
        });
};

export const deleteCategory = async (label: string) => {
    return axiosInstance
        .delete(`/categories/${label}`)
        .then((res) => {
            return res;
        });
};

