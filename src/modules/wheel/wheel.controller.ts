import { Request, Response } from 'express'
import { getWheelsList, getWheelInfo, saveWheelInfo } from '@/modules/wheel/wheel.service'

const express = require('express')
const router = express.Router()


export const getWheels = async (req: Request, res: Response) => {
  try {
    const result = await getWheelsList();
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const getWheelById = async (req: Request, res: Response) => {
  try {
    const result = await getWheelInfo(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const saveWheel = async (req: Request, res: Response) => {
  try {
    const result = await saveWheelInfo(req.body, Number(req.user));
    if (req.body.wheel_id) {
        res.status(200).json(result);
    } else {
        res.status(201).json(result);
    }
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



export default router