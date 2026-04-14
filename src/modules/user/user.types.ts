import { IWheel } from "@/modules/wheel/wheel.types";
import { IRecord } from "@/modules/record/record.types";


export interface IUser {
    user_id: number;
    name: string;
    login: string;
    email: string;
    wheels: IWheel[];
    records: IRecord[];
}

export interface IUserToken {
    user: IUser;
    token: string;
}


////////////////////////////////////////////////////////////////////
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
