
export type GetUserInfoPayload = 
    | { login: string; user_id?: never }     
    | { user_id: number; login?: never }


    export interface TestUser {
    name: string,
    login: string,
    email: string,
    password: string,
    userId: number,
    authToken: string
}
