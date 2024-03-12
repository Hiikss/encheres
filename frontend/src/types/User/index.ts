export interface AuthenticatedUser {
    pseudo: string
    lastname: string
    firstname: string
    email: string
    phoneNumber: string
    street: string
    postalCode: string
    city: string
    password: string
    credit: number
    token: string
}

export interface RequestUser {
    pseudo: string
    lastname: string
    firstname: string
    email: string
    phoneNumber: string
    street: string
    postalCode: string
    city: string
    password: string
}

export interface Credentials {
    login: string
    password: string
}
