import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getconfirmAppointmentInclude } from "@/lib/types";
import { endOfDay, startOfDay } from "date-fns";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const fromdate = req.nextUrl.searchParams.get("fromdate") || "";

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookedSlote = await prisma.confirmAppointment.findMany({
      where: {
        slotDate: {
          gte: startOfDay(new Date(fromdate)),
          lte: endOfDay(new Date(fromdate)),
        },
      },
      include: getconfirmAppointmentInclude(),
    });
    return Response.json(bookedSlote);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Interval server error" }, { status: 500 });
  }
}
