import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

export const identifyContact = async(req: Request, res: Response)=>{
    try {
        const { success } = bodySchema.safeParse(req.body);
        if (!success) {
          return res.status(400).json({
            error: "Invalid request body",
            message: "Bad request please check the inputs",
          });
        }
        const { email, phoneNumber } = req.body;
    
        // Find existing contacts
        const existingContacts = await prisma.contact.findMany({
          where: {
            OR: [
              { email: { equals: email } },
              { phoneNumber: { equals: phoneNumber } },
            ],
          },
        });
    
        let primaryContact: any = null;
        // let updateRequired = false;
    
        if (existingContacts.length === 0) {
          // No existing contacts, create a new primary contact
          primaryContact = await prisma.contact.create({
            data: {
              email,
              phoneNumber,
              linkPrecedence: "primary",
            },
          });
        } else {
          const emailContact = await prisma.contact.findFirst({
            where: {
              email: { equals: email },
            },
          });
          const phoneNumberContact = await prisma.contact.findFirst({
            where: {
              phoneNumber: { equals: phoneNumber },
            },
          });
    
          if (
            phoneNumberContact?.email !== emailContact?.email &&
            phoneNumberContact?.phoneNumber !== emailContact?.phoneNumber &&
            phoneNumberContact?.linkPrecedence === "primary" &&
            emailContact?.linkPrecedence === "primary"
          ) {
            // Update the seconday contact
            if (phoneNumberContact.id > emailContact.id) {
              await prisma.contact.update({
                where: { id: phoneNumberContact.id },
                data: { linkedId: emailContact.id, linkPrecedence: "secondary" },
              });
              primaryContact = emailContact;
            } else {
              await prisma.contact.update({
                where: { id: emailContact.id },
                data: {
                  linkedId: phoneNumberContact.id,
                  linkPrecedence: "secondary",
                },
              });
              primaryContact = phoneNumberContact;
            }
          } else if (phoneNumberContact && emailContact) {
            if (phoneNumberContact.id > emailContact.id) {
              await prisma.contact.update({
                where: { id: phoneNumberContact.id },
                data: { linkedId: emailContact.id, linkPrecedence: "secondary" },
              });
              primaryContact = emailContact;
            } else {
              await prisma.contact.update({
                where: { id: emailContact.id },
                data: {
                  linkedId: phoneNumberContact.id,
                  linkPrecedence: "secondary",
                },
              });
              primaryContact = phoneNumberContact;
            }
          } else if (phoneNumberContact) {
            primaryContact = phoneNumberContact;
            await prisma.contact.create({
              data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: "secondary",
              },
            });
          } else {
            primaryContact = emailContact;
            await prisma.contact.create({
              data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: "secondary",
              },
            });
          }
        }
    
        // Prepare the response
        const allLinkedContacts = await prisma.contact.findMany({
          where: {
            OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
          },
        });
    
        const primaryContactId = primaryContact.id;
        const emails = Array.from(
          new Set(allLinkedContacts.map((contact) => contact.email).filter(Boolean))
        );
        const phoneNumbers = Array.from(
          new Set(
            allLinkedContacts.map((contact) => contact.phoneNumber).filter(Boolean)
          )
        );
        const secondaryContactIds = allLinkedContacts
          .filter((contact) => contact.linkPrecedence === "secondary")
          .map((contact) => contact.id);
    
        return res.json({
          contact: {
            primaryContactId,
            emails,
            phoneNumbers,
            secondaryContactIds,
          },
        });
      } catch (error: any) {
        return res.json({ error: error.message, message: "Something went wrong" });
      }
}

