import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ patientName: null }, { status: 400 });
  }

  const patient = await prisma.addNewPatient.findFirst({
    where: {
      id: {
        equals: id,
        mode: "insensitive",
      },
    },
  });

  if (!patient) {
    return Response.json({ patientName: null }, { status: 400 });
  }

  return Response.json({ patientName: patient?.patientName });
}
