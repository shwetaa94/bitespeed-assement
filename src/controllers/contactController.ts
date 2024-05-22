import { Request, Response } from 'express';
import prisma from '../prisma';

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  try {
    const existingContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      }
    });

     if(!existingContacts){
      const newContact = await prisma.contact.create({
        data: {
          email: email,
          phoneNumber: phoneNumber,
          linkPrecedence: 'primary'
        }
      });

      res.json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: []
        }
      });
    }
    else {

    }
  } catch (err) {
    console.error('Error identifying contact:', err);
    res.status(500).send('Internal Server Error');
  }
};
