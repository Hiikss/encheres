import axiosInstance from '../AxiosInstance';
import { RequestSoldItem, ResponseSoldItem } from '../../types/SoldItem';

export const getSoldItems = async (
    page: number,
    size: number,
    itemName: string,
    category: string,
    filters: string[]
) => {
    const params: string = `?page=${page}&size=${size}&itemName=${itemName}&category=${category}&filters=${filters}`;
    return axiosInstance
        .get<ResponseSoldItem[]>(`/solditems${params}`)
        .then((res) => {
            return res;
        });
};

export const getSoldItem = async (id: string) => {
    return axiosInstance
        .get<ResponseSoldItem>(`/solditems/${id}`)
        .then((res) => {
            return res;
        });
};

export const createSoldItem = async (soldItem: RequestSoldItem) => {
    return axiosInstance
        .post<ResponseSoldItem>(`/solditems`, soldItem)
        .then((res) => {
            return res;
        });
};

export const updateSoldItem = async (id: string, soldItem: RequestSoldItem) => {
    return axiosInstance
        .put<ResponseSoldItem>(`/solditems/${id}`, soldItem)
        .then((res) => {
            return res;
        });
};

export const deleteSoldItem = async (id: string) => {
    return axiosInstance
        .delete(`/solditems/${id}`)
        .then((res) => {
            return res;
        });
};
