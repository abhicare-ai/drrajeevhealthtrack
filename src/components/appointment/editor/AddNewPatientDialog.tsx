"use client";
import LoadingButton from "@/components/LodingButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createNewPatientSchema,
  CreateNewPatientValues,
} from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PhoneInput } from "@/components/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitAppointmetsMutaion } from "./mutation";

interface AddNewPatientDialogProps {
  open: boolean;
  onclose: () => void;
}
export default function AddNewPatientDialog({
  open,
  onclose,
}: AddNewPatientDialogProps) {
  const form = useForm<CreateNewPatientValues>({
    resolver: zodResolver(createNewPatientSchema),
    defaultValues: {
      patientName: "",
      dob: undefined,
      gender: "",
      PhoneNumber: "",
      whatsAppNumber: "",
      city: "",
      source: "",
      apptBookingName: "",
    
      appointmentFor: "",
    },
  });

  const [dbodate, setDobDate] = useState<Date>();
  const [dobSelectedMonth, setDobSelectedMonth] = useState<Date>(new Date());
  const mutation = useSubmitAppointmetsMutaion();
  const onSubmit = async (input: CreateNewPatientValues) => {
    mutation.mutate(input, {
      onSuccess: () => {
        form.reset();

        onclose();
        setDobDate(undefined);
      },
    });
  };

  function handlerOpenChange() {
    if (!mutation.isPending) {
      onclose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handlerOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-6">
          <DialogTitle className="text-center">
            Create New Appointment{" "}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-5">
              {/* 1. Patient Name */}
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>DOB</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full shrink-1 justify-start text-left font-normal",
                            !dbodate && "text-muted-foreground",
                          )}
                          type="button"
                        >
                          <CalendarIcon />
                          {dbodate ? (
                            format(dbodate, "PPP")
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
                            const updated = new Date(dobSelectedMonth);
                            updated.setFullYear(selectedYear);
                            setDobSelectedMonth(updated);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {Array.from(
                              { length: 2025 - 1890 + 1 },
                              (_, i) => 1890 + i,
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
                            selected={dbodate}
                            onSelect={(date) => {
                              setDobDate(date);
                              field.onChange(date); // 🔥 bind value to form
                            }}
                            month={dobSelectedMonth}
                            onMonthChange={setDobSelectedMonth}
                            fromDate={new Date(1890, 0, 1)}
                            toDate={new Date(2025, 11, 31)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              {/* 3. Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              {/* 4. Phone Number */}
              <FormField
                control={form.control}
                name="PhoneNumber"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        defaultCountry="IN"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 5. WhatsApp Number */}
              <FormField
                control={form.control}
                name="whatsAppNumber"
                render={({ field }) => (
                  <FormItem className="!w-full">
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        defaultCountry="IN"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="appointmentFor"
              render={({ field }) => (
                <FormItem className="!w-full">
                  <FormLabel>Appointment For </FormLabel>
                  <FormControl>
                    <Input placeholder="Appointment For" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="!w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apptBookingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created By</FormLabel>
                  <FormControl>
                    <Input placeholder="Write Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={mutation.isPending}
              type="submit"
              className="w-full"
            >
              Submit Appointment
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
