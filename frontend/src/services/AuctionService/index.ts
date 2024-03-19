import axiosInstance from '../AxiosInstance';
import { Auction } from '../../types/Auction';

export const createAuction = async (auction: Auction) => {
    return axiosInstance()
        .post<Auction>(`/auctions`, auction)
        .then((res) => {
            return res;
        });
};