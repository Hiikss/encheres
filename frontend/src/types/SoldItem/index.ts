export type ResponseSoldItem = {
    id: string;
    itemName: string;
    description: string;
    auctionStartDate: Date;
    auctionEndDate: Date;
    startPrice: number;
    sellPrice: number;
    pickUpStreet: string;
    pickUpPostalCode: string;
    pickUpCity: string;
    pickUpDone: boolean;
    category: string;
    lastBidder: string;
    seller: string;
};

export type RequestSoldItem = {
    itemName: string;
    description: string;
    auctionStartDate: Date;
    auctionEndDate: Date;
    startPrice: number;
    sellPrice: number;
    pickUpStreet: string;
    pickUpPostalCode: string;
    pickUpCity: string;
    pickUpDone: boolean;
    categoryLabel: string;
};
