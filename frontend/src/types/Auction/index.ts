export type RequestAuction = {
    auctionPrice: number;
    soldItemId: string;
}

export type ResponseAuction = {
    price: number;
    bidder: string;
    date: Date;
}

