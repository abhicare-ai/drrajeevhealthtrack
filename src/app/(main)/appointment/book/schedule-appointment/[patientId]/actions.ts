"use server";
import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConfirmApptDetaType, getconfirmAppointmentInclude } from "@/lib/types";
import { feeLife, getDurationDaysFromSlotDateAndAmount } from "@/lib/utils";
import {
  confirmAppointmentSchema,
  ConfirmAppointmentValues,
} from "@/lib/validation";
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";

export async function confirmAppoinment(
  input: ConfirmAppointmentValues,
): Promise<{ error?: string; message?: ConfirmApptDetaType }> {
  const {
    id,
    slotDate,
    paymentType,
    slotTime,
    tokenNumber,
    amount,
    primary_Compalint,
  } = confirmAppointmentSchema.parse(input);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const findExitsAppt = await prisma.confirmAppointment.findFirst({
    where: {
      patientId: id,
      slotDate: {
        gte: startOfDay(new Date(slotDate)),
        lte: endOfDay(new Date(slotDate)),
      },
    },
  });

  if (findExitsAppt) {
    return {
      error: "Appointment already exists for this date.",
    };
  }
  const pachegAvailableChecking = await prisma.confirmAppointment.findFirst({
    where: {
      patientId: id,
      startDate: {
        lte: endOfDay(new Date(slotDate)), // ensure package could've started before slotDate
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (pachegAvailableChecking) {
    const packageEndDate = addDays(
      new Date(pachegAvailableChecking.startDate),
      pachegAvailableChecking.durationDays ?? 0,
    );

    const slot = new Date(slotDate);
    const isWithinRange =
      isAfter(slot, pachegAvailableChecking.startDate) &&
      isBefore(slot, packageEndDate);

    if (!isWithinRange) {
      const remaining = packageEndDate.toDateString();
      return {
        error: `Package is valid until ${remaining}. Please choose a slot within this duration.`,
      };
    }
  }
  const appointments = await prisma.confirmAppointment.findFirst({
    where: {
      patientId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (appointments) {
    const apptStartDate = appointments.startDate;
    const apptTotalDuration = appointments.durationDays;
    const apptAmount = appointments.amount;
    const pymettype = appointments.paymentType;
    const startDate = appointments.startDate;

    let remainingDays = apptTotalDuration ?? 0;

    const daysUsed = differenceInCalendarDays(
      new Date(),
      new Date(apptStartDate),
    );
    if (daysUsed > 0) {
      remainingDays = remainingDays - daysUsed;
      if (remainingDays < 0) remainingDays = 0;
    }

    console.log("Remaining Days:", remainingDays);
    if (remainingDays >= 0) {
      if (!tokenNumber) {
        const parsedDate = new Date(slotDate);

        const existingAppointments = await prisma.confirmAppointment.findMany({
          where: {
            slotDate: {
              gte: startOfDay(parsedDate),
              lte: endOfDay(parsedDate),
            },
          },
          select: { tokenNumber: true },
        });

        // 👇 TokenNumbers jisme isCancell: true ya false dono include hain
        const allUsedTokens = new Set(
          existingAppointments.map((appt) => appt.tokenNumber),
        );

        // ✅ Remove those with isCancell: true
        const activeAppointments = await prisma.confirmAppointment.findMany({
          where: {
            slotDate: {
              gte: startOfDay(parsedDate),
              lte: endOfDay(parsedDate),
            },
            isCancell: false,
          },
          select: { tokenNumber: true },
        });

        const activeTokens = new Set(
          activeAppointments.map((appt) => appt.tokenNumber),
        );

        // 📌 Generate next available token not used before (even cancelled)
        let nextToken = 1;
        while (allUsedTokens.has(nextToken)) {
          if (!activeTokens.has(nextToken)) {
            // Token exists but was cancelled ⇒ skip it permanently
            nextToken++;
            continue;
          }
          nextToken++;
        }

        const message = await prisma.confirmAppointment.create({
          data: {
            patientId: id,
            slotDate,
            paymentType: pymettype,
            slotTime,
            tokenNumber: nextToken,
            primary_Compalint,
            amount: apptAmount,
            startDate: startDate,
            feelife: feeLife(apptAmount ?? undefined)?.days,
            durationDays: getDurationDaysFromSlotDateAndAmount(
              startDate,
              apptAmount ?? undefined,
            ),
          },
          include: getconfirmAppointmentInclude(),
        });

        return { message };
      }

      const bookedToken = await prisma.confirmAppointment.findMany({
        where: {
          slotDate: {
            gte: startOfDay(new Date(slotDate)),
            lte: endOfDay(new Date(slotDate)),
          },
          tokenNumber,
        },
      });

      if (bookedToken.length > 0) {
        return {
          error:
            "Appointment slot is already booked. Please choose a different slot.",
        };
      }

      const message = await prisma.confirmAppointment.create({
        data: {
          patientId: id,
          slotDate,
          paymentType: pymettype,
          slotTime,
          tokenNumber,
          primary_Compalint,
          amount: apptAmount,
          startDate: startDate,
          feelife: feeLife(apptAmount ?? undefined)?.days,
          durationDays: getDurationDaysFromSlotDateAndAmount(
            startDate,
            apptAmount ?? undefined,
          ),
        },
        include: getconfirmAppointmentInclude(),
      });

      return { message };
    } else {
      if (!tokenNumber) {
        if (!amount) {
          return {
            error: "Your package has expired. Please select a new amount.",
          };
        }
        const parsedDate = new Date(slotDate);
        const existingAppointments = await prisma.confirmAppointment.findMany({
          where: {
            slotDate: {
              gte: startOfDay(parsedDate),
              lte: endOfDay(parsedDate),
            },
          },
          select: { tokenNumber: true },
        });

        // 👇 TokenNumbers jisme isCancell: true ya false dono include hain
        const allUsedTokens = new Set(
          existingAppointments.map((appt) => appt.tokenNumber),
        );

        // ✅ Remove those with isCancell: true
        const activeAppointments = await prisma.confirmAppointment.findMany({
          where: {
            slotDate: {
              gte: startOfDay(parsedDate),
              lte: endOfDay(parsedDate),
            },
            isCancell: false,
          },
          select: { tokenNumber: true },
        });

        const activeTokens = new Set(
          activeAppointments.map((appt) => appt.tokenNumber),
        );

        // 📌 Generate next available token not used before (even cancelled)
        let nextToken = 1;
        while (allUsedTokens.has(nextToken)) {
          if (!activeTokens.has(nextToken)) {
            // Token exists but was cancelled ⇒ skip it permanently
            nextToken++;
            continue;
          }
          nextToken++;
        }

        // 4. Create the new appointment with the correct tokenNumber
        const message = await prisma.confirmAppointment.create({
          data: {
            patientId: id,
            slotDate,
            paymentType,
            slotTime,
            tokenNumber: nextToken,
            primary_Compalint,
            amount,
            startDate: slotDate,
            feelife: feeLife(amount)?.days,
            durationDays: getDurationDaysFromSlotDateAndAmount(
              slotDate,
              amount,
            ),
          },
          include: getconfirmAppointmentInclude(),
        });

        return { message };
      }
      if (!amount) {
        return {
          error: "Your package has expired. Please select a new amount.",
        };
      }
      const message = await prisma.confirmAppointment.create({
        data: {
          patientId: id,
          slotDate,
          paymentType,
          slotTime,
          tokenNumber,
          primary_Compalint,
          amount,
          startDate: slotDate,
          feelife: feeLife(amount)?.days,

          durationDays: getDurationDaysFromSlotDateAndAmount(slotDate, amount),
        },
        include: getconfirmAppointmentInclude(),
      });

      return { message };
    }
  }

  ///////////////////nee patent/////////
  if (!tokenNumber) {
    if (!amount) {
      return {
        error: "Please select amount.",
      };
    }
    console.log("new pateint");
    const parsedDate = new Date(slotDate);
    const existingAppointments = await prisma.confirmAppointment.findMany({
      where: {
        slotDate: {
          gte: startOfDay(parsedDate),
          lte: endOfDay(parsedDate),
        },
      },
      select: { tokenNumber: true },
    });

    // 👇 TokenNumbers jisme isCancell: true ya false dono include hain
    const allUsedTokens = new Set(
      existingAppointments.map((appt) => appt.tokenNumber),
    );

    // ✅ Remove those with isCancell: true
    const activeAppointments = await prisma.confirmAppointment.findMany({
      where: {
        slotDate: {
          gte: startOfDay(parsedDate),
          lte: endOfDay(parsedDate),
        },
        isCancell: false,
      },
      select: { tokenNumber: true },
    });

    const activeTokens = new Set(
      activeAppointments.map((appt) => appt.tokenNumber),
    );

    // 📌 Generate next available token not used before (even cancelled)
    let nextToken = 1;
    while (allUsedTokens.has(nextToken)) {
      if (!activeTokens.has(nextToken)) {
        // Token exists but was cancelled ⇒ skip it permanently
        nextToken++;
        continue;
      }
      nextToken++;
    }

    // 4. Create the new appointment with the correct tokenNumber
    const message = await prisma.confirmAppointment.create({
      data: {
        patientId: id,
        slotDate,
        paymentType,
        slotTime,
        primary_Compalint,
        tokenNumber: nextToken,
        amount,
        feelife: feeLife(amount)?.days,
        startDate: slotDate,
        durationDays: getDurationDaysFromSlotDateAndAmount(slotDate, amount),
      },
      include: getconfirmAppointmentInclude(),
    });

    return { message };
  }
  if (!amount) {
    return {
      error: "Please select amount.",
    };
  }
  const bookedToken = await prisma.confirmAppointment.findMany({
    where: {
      slotDate: {
        gte: startOfDay(new Date(slotDate)),
        lte: endOfDay(new Date(slotDate)),
      },
      tokenNumber,
    },
  });

  if (bookedToken.length > 0) {
    return {
      error:
        "Appointment slot is already booked. Please choose a different slot.",
    };
  }

  const message = await prisma.confirmAppointment.create({
    data: {
      patientId: id,
      slotDate,
      paymentType,
      slotTime,
      tokenNumber,
      primary_Compalint,
      amount,
      feelife: feeLife(amount)?.days,
      startDate: slotDate,
      durationDays: getDurationDaysFromSlotDateAndAmount(slotDate, amount),
    },
    include: getconfirmAppointmentInclude(),
  });

  return { message };
}
