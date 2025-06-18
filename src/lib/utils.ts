import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, format } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateAge = (dobInput?: string | Date): string => {
  if (!dobInput) return "";

  const dob = new Date(dobInput);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age.toString();
};

export function formatDate(dateInput?: string | Date): string {
  if (!dateInput) return "";
  try {
    return format(new Date(dateInput), "d/M/yyyy");
  } catch {
    return "";
  }
}

export function formatTime(timeInput: string | Date): string {
  try {
    return format(new Date(timeInput), "h:mm a");
    // Example output: "6:00 AM"
  } catch {
    return "";
  }
}

export function getDurationDaysFromSlotDateAndAmount(
  slotDate: Date,
  amount?: number,
): number | null {
  if (!amount || !slotDate) return null;

  const plan = totaldayWithFeePlan(amount);
  if (!plan) return null;

  const today = new Date();
  const daysPassed = differenceInCalendarDays(today, slotDate);
  const remainingDays = plan.days - daysPassed;

  return remainingDays > 0 ? remainingDays : 0;
}
export function totaldayWithFeePlan(fee: number | undefined) {
  if (fee === 600) return { days: 30, fee: 600 };
  if (fee === 1250) return { days: 90, fee: 1250 };
  if (fee === 2150) return { days: 180, fee: 2150 };
  if (fee === 3500) return { days: 365, fee: 3500 };
  return null;
}

export function feeLife(fee: number | undefined) {
  if (fee === 600) {
    return {
      days: 30,
      fee: 600,
    };
  } else if (fee == 1250) {
    return {
      days: 90,
      fee: 1250,
    };
  } else if (fee == 2150) {
    return {
      days: 180,
      fee: 2150,
    };
  } else if (fee == 3500) {
    return {
      days: 365,
      fee: 3500,
    };
  }
}

const elevenToTwelve = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const twelveToOne = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const oneToTwo = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40,
];
const fourToFive = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
const fiveToSix = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const sixToSeven = [
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100, 101, 102, 103, 104, 105,
];

export function getSlotFromToken(tokenNumber: number): string {
  if (elevenToTwelve.includes(tokenNumber)) return "11:00AM - 12:00PM";
  if (twelveToOne.includes(tokenNumber)) return "12:00PM - 01:00PM";
  if (oneToTwo.includes(tokenNumber)) return "01:00PM - 02:00PM";
  if (fourToFive.includes(tokenNumber)) return "04:00PM - 05:00PM";
  if (fiveToSix.includes(tokenNumber)) return "05:00PM - 06:00PM";
  if (sixToSeven.includes(tokenNumber)) return "06:00PM - 07:00PM";
  return "Invalid Token"; // fallback
}

export function getRemainingDays(
  slotDate: Date,
  durationDays?: number,
): number | string {
  if (!slotDate || durationDays === undefined) return "N/A";

  const today = new Date();
  const daysPassed = differenceInCalendarDays(today, slotDate);
  const remaining = durationDays - daysPassed;

  return remaining > 0 ? remaining : 0;
}
