import axiosInstance from '../AxiosInstance';
import { RequestAuction, ResponseAuction } from '../../types/Auction';

export const getAuctions = async (soldItemId: string) => {
    return axiosInstance
        .get<ResponseAuction[]>(`/auctions?soldItemId=${soldItemId}`,)
        .then((res) => {
            return res;
        });
};

export const createAuction = async (auction: RequestAuction) => {
    return axiosInstance
        .post<RequestAuction>(`/auctions`, auction)
        .then((res) => {
            return res;
        });
};