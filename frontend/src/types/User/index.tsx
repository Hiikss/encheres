export type AuthUser = {
    pseudo: string;
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    street: string;
    postalCode: string;
    city: string;
    credit: number;
    admin: boolean;
    token: string;
};

export type RequestUser = {
    pseudo: string;
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    street: string;
    postalCode: string;
    city: string;
    password: string;
    credit: number;
    active: boolean;
};

export type Credentials = {
    login: string;
    password: string;
};
