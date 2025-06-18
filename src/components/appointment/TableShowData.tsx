import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApptData } from "@/lib/types";
import { calculateAge } from "@/lib/utils";
import TableMoreButton from "./TableMoreButton";

interface TableShowDataProps {
  apptData: ApptData[];
}

export default function TableShowData({ apptData }: TableShowDataProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient ID</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Phone No.</TableHead>
          <TableHead>WhatsApp No.</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Appointment For </TableHead>

          <TableHead>Created By</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>More</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apptData.map((appt) => (
          <TableRow key={appt.id}>
            <TableCell>{appt.patientId}</TableCell>
            <TableCell>{appt.patientName}</TableCell>
            <TableCell>{appt.PhoneNumber}</TableCell>
            <TableCell>{appt.whatsAppNumber}</TableCell>
            <TableCell>{appt.city}</TableCell>
            <TableCell>{appt.gender}</TableCell>
            <TableCell>{calculateAge(appt.dob)}</TableCell>
            <TableCell>{appt.source}</TableCell>
            <TableCell>{appt.appointmentFor}</TableCell>

            <TableCell>{appt.apptBookingName}</TableCell>
            <TableCell>{appt.clinicCity}</TableCell>
            <TableCell>
              <TableMoreButton apptData={appt} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
