import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmetSkelaton() {
  return (
    <Table>
      <TableHeader className="bg-sidebar">
        <TableRow>
          <TableHead>Patient ID</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Phone No.</TableHead>
          <TableHead>WhatsApp No.</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Appointment For</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>More</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-14 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-20 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-20 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-12 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-10 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-14 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
