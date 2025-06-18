import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PatientAppointmetDeta from "./PatientAppointmetDeta";

const getUser = cache(async (id: string) => {
  const patient = await prisma.addNewPatient.findFirst({
    where: {
      id: {
        equals: id,
        mode: "insensitive",
      },
    },
  });

  if (!patient) notFound();

  return patient;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ patientId: string }>;
}): Promise<Metadata> {
  const { patientId } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const patient = await getUser(patientId);

  return {
    title: `${patient.patientName} (@${patient.id})`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  return (
    <PatientAppointmetDeta idx={patientId}/>
  )
}
