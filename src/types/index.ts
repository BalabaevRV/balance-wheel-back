export interface SignupPayload {
	login: string,
	password: string
	name?: string
}

export interface LoginPayload {
	login: string,
	password: string
}
