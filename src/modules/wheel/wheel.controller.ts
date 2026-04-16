import { Request, Response } from 'express'
import { getWheelFromDb, createWheelInDb, deleteWheelFromDb, editWheelById } from '@/modules/wheel/wheel.model'

const express = require('express')
const router = express.Router()


export const getWheels = async (req: Request, res: Response) => {

}

export const getWheelById = async (req: Request, res: Response) => {
  try {
    console.log(3)
    const result = await getWheelFromDb(Number(req.params.id));
    res.status(200).json(result);
    console.log(2)
  } catch (error) {
    // Проверяем тип ошибки
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    
    // Общая ошибка сервера
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const createWheel = async (req: Request, res: Response) => {
  try {
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

export const editWheel = async (req: Request, res: Response) => {
    try {
    const result = await editWheelById(req.body, Number(req.user));
    res.status(200).json(result);
  } catch (error) {
    // Проверяем тип ошибки
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    
    // Общая ошибка сервера
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const deleteWheel = (req: Request, res: Response) => {

}

export default router