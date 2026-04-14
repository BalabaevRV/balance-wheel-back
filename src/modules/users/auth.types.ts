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