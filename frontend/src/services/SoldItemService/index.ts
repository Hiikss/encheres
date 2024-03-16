import axiosInstance from '../AxiosInstance';
import { ResponseSoldItem } from '../../types/SoldItem';

export const getSoldItems = async (page: number, size: number, itemName: string, category:string, filters: string[]) => {
    const params: string = `?page=${page}&size=${size}&itemName=${itemName}&category=${category}&filters=${filters}`
    return axiosInstance()
        .get<ResponseSoldItem[]>(`/solditems${params}`)
        .then((res) => {
            return res;
        });
};

export const getSoldItem = async (id: string) => {
    return axiosInstance()
        .get<ResponseSoldItem>(`/solditems/${id}`)
        .then((res) => {
            return res;
        });
};
