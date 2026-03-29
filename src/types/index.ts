export interface SignupPayload {
	login: string,
	password: string,
	email: string,
	name?: string
}

export interface LoginPayload {
	login: string,
	password: string
}


export interface DeletePayload {
	login: string
}

export type GetUserInfoPayload = 
    | { login: string; user_id?: never }     
    | { user_id: number; login?: never }; 

