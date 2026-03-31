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
    | { user_id: number; login?: never }

export interface Wheel {
	wheel_id?: number,
	name: string,
	intervalSeconds: number
}	

export interface Field {
	field_id?: number,
	name: string,
	color_hex: string
}

export interface CreateWheelPayload {
	wheel: Wheel,
	fields: Field[]
}