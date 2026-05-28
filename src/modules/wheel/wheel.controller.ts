import { Request, Response } from 'express'
import { saveWheelInfo, attachWheelToUser, detachWheelFromUser } from '@/modules/wheel/wheel.service'
import { getWheelsByIdArray, getWheelsList } from '@/modules/wheel/wheel.model'
const express = require('express')
const router = express.Router()


export const getWheels = async (req: Request, res: Response) => {
  try {
    const wheelsList = await getWheelsList();
    const answer = {
      message: 'Wheels retrieved successfully',
      success: true,
      data: wheelsList
    }
    res.status(200).json(answer);
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
    const wheelInfo = await getWheelsByIdArray([Number(req.params.id)]);
    const answer = {
      message: 'Wheel info got successfully',
      success: true,
      data: wheelInfo[0]
    }
    res.status(200).json(answer);
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
    const wheel = await saveWheelInfo(req.body, Number(req.user));
    const answer = { 
        message: 'Wheel info updated successfully',
        success: true,
        data: wheel
    }
    const statusCode = req.body.wheel_id ? 200 : 201;
    res.status(statusCode).json(answer);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const attachWheel = async (req: Request, res: Response) => {
  try {
    const userInfo = await attachWheelToUser(Number(req.params.wheelId), Number(req.user));
    const answer = { 
            message: 'Wheel attached to user successfully',
            success: true,
            data: userInfo
    }
    res.status(200).json(answer);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const detachWheel = async (req: Request, res: Response) => {
  try {
    const userInfo = await detachWheelFromUser(Number(req.params.wheelId), Number(req.user));
    const answer = { 
            message: 'Wheel detached from user successfully',
            success: true,
            data: userInfo
    }
    res.status(200).json(answer);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




export default router