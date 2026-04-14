
import { Field } from "@/modules/wheel/field.types";

export interface Wheel {
	wheel_id?: number,
	name: string,
	intervalSeconds: number
}	

export interface CreateWheelPayload {
    wheel: Wheel,
    fields: Field[]
}