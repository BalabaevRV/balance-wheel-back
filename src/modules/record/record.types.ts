import { IField } from "@/modules/wheel/field.types";

export interface IRecord {
    record_id: number;
    wheel_id: number;
    balance_wheel_name: string;
    created_at: Date;
    updated_at: Date;
    date: Date;
    values: IFieldValue[];
}

export interface IFieldValue extends IField {
    value: number;
}

