import { Request, Response } from 'express'
import { getWheelsList, getWheelFromDb, createWheelInDb, deleteWheelFromDb, editWheelById } from '@/models/WheelModel'

const express = require('express')
const router = express.Router()


export const getWheels = (req: Request, res: Response) => {

}

export const getWheelById = (req: Request, res: Response) => {

}

export const createWheel = async (req: Request, res: Response) => {
  try {
    console.log('123')
    console.log(req.user)
    const result = await createWheelInDb(req.body, Number(req.user));
    res.status(201).json(result);
  } catch (error) {
    // Проверяем тип ошибки
    if (error instanceof Error) {
      if (error.message === 'Wheel already exists') {
        return res.status(400).json({ error: error.message });
      }
    }
    
    // Общая ошибка сервера
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const editWheel = (req: Request, res: Response) => {

}

export const deleteWheel = (req: Request, res: Response) => {

}

export default router