import { Prisma } from "@prisma/client";

export function getUserDataSelect() {
  return {
    id: true,
    email: true,
    branch: true,
    avatarUrl: true,
    isAdmin: true,
    isDoctor: true,
    createdAt: true,

    _count: {
      select: {
        AddNewPatient: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getApptDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
    _count: {
      select: {
        confirmAppointment: true,
      },
    },
  } satisfies Prisma.AddNewPatientInclude;
}

export type ApptData = Prisma.AddNewPatientGetPayload<{
  include: ReturnType<typeof getApptDataInclude>;
}>;

export interface AppoinmentsPage {
  appoinments: ApptData[];
  nextCursor: string | null;
}

// .................

export function getAddNewApptDataSelect() {
  return {
    id: true,
    userId: true,
    clinicCity: true,
    patientId: true,
    apptBookingName: true,
    patientName: true,
    dob: true,
    gender: true,
    PhoneNumber: true,
    whatsAppNumber: true,
    city: true,
    source: true,

    appointmentFor: true,
    createdAt: true,
  } satisfies Prisma.AddNewPatientSelect;
}

export type AddNewPatientData = Prisma.AddNewPatientGetPayload<{
  select: ReturnType<typeof getAddNewApptDataSelect>;
}>;
export function getconfirmAppointmentInclude() {
  return {
    addNewPatient: {
      select: getAddNewApptDataSelect(),
    },
  } satisfies Prisma.confirmAppointmentInclude;
}

export type confirmAppointmentData = Prisma.confirmAppointmentGetPayload<{
  include: ReturnType<typeof getconfirmAppointmentInclude>;
}>;

export interface ConfirmAppoinmentsPage {
  confirmAppointmentData: confirmAppointmentData[];
  nextCursor: string | null;
}


export interface ConfirmApptDetaType {
  id?: string;
  patientId?: string;
  tokenNumber?: number;
  slotDate?: Date;
  slotTime?: string;
  paymentType?: string | null;
  startDate?: Date;
  durationDays?: number | null;
  feelife?:number | null;
  primary_Compalint?: string[];
  amount?: number | null;
  orderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  isCancell?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  addNewPatient?: {
    id: string;
    createdAt: Date;
    userId: string;
    clinicCity: string;
    patientId: number;
    apptBookingName: string;
    patientName: string;
    dob: Date;
    gender: string;
    PhoneNumber: string;
    whatsAppNumber: string;
    city: string;
    source: string;
    appointmentFor: string;
  };
}



// ..........
