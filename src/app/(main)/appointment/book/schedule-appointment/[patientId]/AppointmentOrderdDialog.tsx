"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmApptDetaType } from "@/lib/types";
import Image from "next/image";
import avatar from "@/assets/avatar-placeholder.png";
import { calculateAge, formatDate, getSlotFromToken } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppointmentOrderdDialogProps {
  orderdeta: ConfirmApptDetaType;
  onclose: () => void;
  open: boolean;
}

export default function AppointmentOrderdDialog({
  onclose,
  open,
  orderdeta,
}: AppointmentOrderdDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onclose} modal={true}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="hidden space-y-6">
          <DialogTitle className="text-center font-bold">
            Prescription Generator with Doctor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2 text-center">
            <Image
              src={avatar}
              alt="avatar"
              className="mx-auto h-[100px] w-[100px] rounded-full"
            />
            <p className="font-bold uppercase">
              {orderdeta.addNewPatient?.patientName}
            </p>
            <p className="font-bold uppercase">
              Patient Id:- {orderdeta.addNewPatient?.patientId}
            </p>
            <p className="font-bold uppercase">
              Age:- {calculateAge(orderdeta.addNewPatient?.dob)}
            </p>
            <p className="font-bold uppercase">
              {orderdeta.addNewPatient?.city}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between border border-r-0 border-l-0 py-3">
              <div>Appointment Status:</div>
              <Button variant="default" className="cursor-default">
                Confirmed
              </Button>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Appointment Date:</div>
              <div>{formatDate(orderdeta.slotDate)}</div>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Time Slot:</div>
              <div>{getSlotFromToken(orderdeta.tokenNumber ?? 1)}</div>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Booking Date:</div>
              <div>{formatDate(orderdeta.createdAt)}</div>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Seat No.:</div>
              <div>{orderdeta.tokenNumber}</div>
            </div>
            <div className="flex items-center justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Booking Status:</div>

              <Button variant="default" className="cursor-default">
                Booked
              </Button>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Payment Status:</div>
              <div>{orderdeta.paymentType}</div>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Fees:</div>
              <div>{orderdeta.amount}</div>
            </div>
            <div className="flex items-center justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Duration:</div>
              <div>{orderdeta.feelife}</div>
            </div>
            <div className="flex justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Remaining Days:</div>
              <div>{orderdeta.durationDays}</div>
            </div>
            <div className="flex items-center justify-between border border-t-0 border-r-0 border-l-0 py-3">
              <div>Primary Complaint:</div>
              <div className="uppercase">
                {orderdeta.primary_Compalint?.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
