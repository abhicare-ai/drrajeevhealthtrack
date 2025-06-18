"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { confirmAppoinment } from "./actions";
import { toast } from "sonner";
import LoadingButton from "@/components/LodingButton";
import { TagsInput } from "@/components/TagsInput";
import AppointmentOrderdDialog from "./AppointmentOrderdDialog";
import { ConfirmAppoinmentsPage, ConfirmApptDetaType } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

const morningSlots = [
  "11:00AM - 12:00PM",
  "12:00PM - 01:00PM",
  "01:00PM - 02:00PM",
];
const eveningSlots = [
  "04:00PM - 05:00PM",
  "05:00PM - 06:00PM",
  "06:00PM - 07:00PM",
];
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

interface PatientAppointmetDetaProps {
  idx: string;
}
export default function PatientAppointmetDeta({
  idx,
}: PatientAppointmetDetaProps) {
  const [fromdate, setFromDate] = useState<Date>();
  const [fromSelectedMonth, setFromSelectedMonth] = useState<Date>(new Date());
  const [shirf, setShirf] = useState<string>("morning");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = shirf === "morning" ? morningSlots : eveningSlots;

  const [payment, setPayment] = useState<string>();

  const [selectedToken, setSelectedToken] = useState(0);

  const [selectedFee, selSelectedFee] = useState<number>();
  const [primaryComplaint, setPrimaryComplaint] = useState<string[]>([]);

  const [dialogBox, setDialogBox] = useState(false);
  const [message, setMessage] = useState<ConfirmApptDetaType | null>(null);
  const [loding, setloding] = useState(false);

  const input = {
    id: idx,
    slotDate: fromdate as Date,
    paymentType: payment as string,
    slotTime: selectedSlot as string,
    tokenNumber: selectedToken || undefined,
    amount: selectedFee,
    primary_Compalint: primaryComplaint as [string, ...string[]],
  };
  const submitData = async () => {
    if (!fromdate || !selectedSlot || primaryComplaint.length === 0) {
      toast.error("Please select a date, time slot and primary compalint.");
      return;
    }
    try {
      setloding(true);
      const { error, message } = await confirmAppoinment(input);

      if (message) {
        setDialogBox(true);
        setMessage(message);
      }
      if (error) {
        toast.error(error);
      }

      setFromDate(undefined);
      setSelectedToken(0);
      selSelectedFee(undefined);
      setPrimaryComplaint([]);
    } catch (error) {
      console.error(error);
      toast.error("Interval server error.");
      setloding(false);
    } finally {
      setloding(false);
    }
  };

  const {
    data: bookedSlote,
    isLoading,
    isError,
    error,
  } = useQuery({
    enabled: !!fromdate,

    queryKey: ["booked-slote", "throwdatewise", fromdate],
    queryFn: () =>
      kyInstance
        .get(`/api/appointment/booked-token?fromdate=${fromdate}`)
        .json<ConfirmApptDetaType[]>(),
  });

  const confirmedTokens = new Set(
    bookedSlote?.filter((t) => !t.isCancell).map((t) => t.tokenNumber),
  );
  console.log(confirmedTokens);
  const cancelledTokens = new Set(
    bookedSlote?.filter((t) => t.isCancell).map((t) => t.tokenNumber),
  );

  return (
    <>
      <div className="flex flex-col gap-5 p-3 md:flex-row">
        <div className="space-y-5 md:w-1/3">
          {/* Date Picker */}
          <div className="space-y-3">
            <p>Choose A Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full shrink-1 justify-start text-left font-normal",
                    !fromdate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {fromdate ? (
                    format(fromdate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
              >
                <Select
                  onValueChange={(value) => {
                    const selectedYear = parseInt(value);
                    const updated = new Date(fromSelectedMonth);
                    updated.setFullYear(selectedYear);
                    setFromSelectedMonth(updated);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {Array.from(
                      { length: 2025 - 1990 + 1 },
                      (_, i) => 1990 + i,
                    ).map((yr) => (
                      <SelectItem key={yr} value={yr.toString()}>
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={fromdate}
                    onSelect={setFromDate}
                    month={fromSelectedMonth}
                    onMonthChange={setFromSelectedMonth}
                    fromDate={new Date(1990, 0, 1)}
                    toDate={new Date(2025, 11, 31)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/*   Payment */}
          <div className="space-y-3">
            <p>Paymet</p>
            <Select onValueChange={setPayment} value={payment}>
              <SelectTrigger className="!w-full">
                <SelectValue placeholder="Paymet Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {payment === "UPI" ? (
            <Button className="w-full">Process To Payment</Button>
          ) : null}
          {payment === "CASH" && (
            <Select
              onValueChange={(v) => selSelectedFee(Number(v))}
              value={selectedFee?.toString()}
            >
              <SelectTrigger className="!w-full">
                <SelectValue placeholder="Fee Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="600">₹600 - 30 Days</SelectItem>
                <SelectItem value="1250">₹1250 - 90 Days</SelectItem>
                <SelectItem value="2150">₹2150 - 180 Days</SelectItem>
                <SelectItem value="3500">₹3500 - 365 Days</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="space-y-3">
            <p> Primary Complaint</p>
            <TagsInput
              value={primaryComplaint ?? []}
              onValueChange={(newValue) => {
                setPrimaryComplaint(newValue); // local state
              }}
              placeholder="Enter Primary Complaint"
              className="w-full"
            />
          </div>
          {/* Shift Selector */}
          <div className="space-y-3">
            <p>Shift</p>
            <Select onValueChange={setShirf} value={shirf}>
              <SelectTrigger className="!w-full">
                <SelectValue placeholder="Select Shift" />
              </SelectTrigger>
              <SelectContent defaultValue="morning">
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Time Slots */}
          <div className="space-y-3">
            <p>Time Slots</p>
            <div className="space-y-3">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  className="w-full"
                  variant={selectedSlot === slot ? "default" : "secondary"}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
          <LoadingButton
            loading={loding}
            className="w-full"
            onClick={submitData}
          >
            Confirm Appointment
          </LoadingButton>
        </div>
        <div className="md:w-2/3">
          <div className="flex flex-wrap gap-3">
            {selectedSlot === "11:00AM - 12:00PM" &&
              elevenToTwelve.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}

            {selectedSlot === "12:00PM - 01:00PM" &&
              twelveToOne.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}

            {selectedSlot === "01:00PM - 02:00PM" &&
              oneToTwo.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}

            {selectedSlot === "04:00PM - 05:00PM" &&
              fourToFive.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}

            {selectedSlot === "05:00PM - 06:00PM" &&
              fiveToSix.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}

            {selectedSlot === "06:00PM - 07:00PM" &&
              sixToSeven.map((v) => (
                <Button
                  variant={
                    confirmedTokens.has(v)
                      ? "destructive"
                      : cancelledTokens.has(v)
                        ? "default"
                        : selectedToken === v
                          ? "default"
                          : "secondary"
                  }
                  disabled={confirmedTokens.has(v) || cancelledTokens.has(v)}
                  className={cn(
                    "w-fit",
                    selectedToken === v &&
                      !confirmedTokens.has(v) &&
                      !cancelledTokens.has(v) &&
                      "bg-green-500 hover:bg-green-500",
                    (confirmedTokens.has(v) || cancelledTokens.has(v)) &&
                      "cursor-default",
                  )}
                  key={v}
                  onClick={() => {
                    if (!confirmedTokens.has(v) && !cancelledTokens.has(v)) {
                      setSelectedToken(v);
                    }
                  }}
                >
                  {v}
                </Button>
              ))}
          </div>
        </div>
      </div>

      {message && (
        <AppointmentOrderdDialog
          orderdeta={message!} // ✅ non-null assertion since we're opening only when it exists
          open={dialogBox}
          onclose={() => setDialogBox(false)}
        />
      )}
    </>
  );
}
