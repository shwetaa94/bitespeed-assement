import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

export const identifyContact = async(req: Request, res: Response)=>{
  const { success } = bodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body",
      message: "Enter inputs in correct syntax",
    });
  }
  res.send("hello")
}

