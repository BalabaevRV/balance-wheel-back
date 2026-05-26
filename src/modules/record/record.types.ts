import { IField } from "@/modules/wheel/field.types";

export interface IRecord {
    record_id: number;
    user_id: number;
    wheel_id: number;
    balance_wheel_name: string;
    created_at: Date;
    updated_at: Date;
    date: Date;
    values: IFieldValue[];
}

export type IRecordSave = Omit<IRecord, 'record_id' | 'created_at' | 'updated_at' | 'balance_wheel_name' |  'date'> & Partial<IRecord>;

export interface IFieldValue extends IField {
    value: number;
}

