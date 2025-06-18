"use server";

import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import redisClient from "@/lib/redis";
import { getApptDataInclude } from "@/lib/types";

import {
  createNewPatientSchema,
  CreateNewPatientValues,
} from "@/lib/validation";

export async function appoinment(input: CreateNewPatientValues) {
  const {
    apptBookingName,
    patientName,
    dob,
    gender,
    PhoneNumber,
    whatsAppNumber,
    city,
    source,

    appointmentFor,
  } = createNewPatientSchema.parse(input);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const lastPatientId = await prisma.addNewPatient.count({
    orderBy: {
      createdAt: "desc",
    },
  });

  const patientId = lastPatientId + 1;

  const newPost = await prisma.addNewPatient.create({
    data: {
      userId: user.id,
      patientId: patientId,
      clinicCity: user.branch,
      apptBookingName,
      patientName,
      dob,
      gender,
      PhoneNumber,
      whatsAppNumber,
      city,
      source,

      appointmentFor,
    },
    include: getApptDataInclude(),
  });

  const keys = await redisClient.keys(
    `appointment-feed:for-you:userId:${user.id}:*`,
  );
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }

  return newPost;
}
