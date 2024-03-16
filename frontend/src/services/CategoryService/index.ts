import axiosInstance from '../AxiosInstance';
import { Category } from '../../types/Category';

export const getCategories = async () => {
    return axiosInstance()
        .get<Category[]>(`/categories`)
        .then((res) => {
            return res;
        });
};
