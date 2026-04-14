
import { IField } from "@/modules/wheel/field.types";

export interface IWheel {
    wheel_id: number;
    owner_id: number;
    name: string;
    interval_seconds: number;
    fields: IField[];
}
