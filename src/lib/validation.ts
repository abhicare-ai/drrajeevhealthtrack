import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const loginSchema = z.object({
  email: requiredString.email("Invalid email"),
  branch: requiredString,
  password: requiredString,
});
export type LoginValues = z.infer<typeof loginSchema>;

export const createNewPatientSchema = z.object({
  patientName: requiredString,
  dob: z.date({
    required_error: "Required",
  }),
  gender: requiredString,
  PhoneNumber: requiredString,
  whatsAppNumber: requiredString,
  city: requiredString,
  source: requiredString,
  apptBookingName: requiredString,

  appointmentFor: requiredString,
});
export type CreateNewPatientValues = z.infer<typeof createNewPatientSchema>;

export const confirmAppointmentSchema = z.object({
  id: requiredString,
  slotDate: z.date({
    required_error: "Required",
  }),

  paymentType: z.string().optional(),
  slotTime: requiredString,
  tokenNumber: z.number().optional(),

  amount: z.number().optional(),

   primary_Compalint: z.array(z.string()).nonempty("Required "),
});

export type ConfirmAppointmentValues = z.infer<typeof confirmAppointmentSchema>;
