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

export type PartialUserRequest = {
    pseudo: string;
    active: boolean;
};

export type Credentials = {
    login: string;
    password: string;
};

export type ResponseUser = {
    pseudo: string;
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    street: string;
    postalCode: string;
    city: string;
    credit: number;
    active: boolean;
};
