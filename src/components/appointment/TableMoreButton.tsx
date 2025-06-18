import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CalendarPlus,
  Edit,
  MoreHorizontal,
  ScanSearch,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { ApptData } from "@/lib/types";

interface TableMoreButtonProps {
  apptData: ApptData;
}

export default function TableMoreButton({ apptData }: TableMoreButtonProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="text-muted-foreground size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <Link href={`/appointment/book/schedule-appointment/${apptData.id}`}>
            <DropdownMenuItem>
              <span className="text-muted-foreground flex items-center gap-3">
                <CalendarPlus className="size-4" /> Schedule Appointment
              </span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <span className="text-muted-foreground flex items-center gap-3">
              <ScanSearch className="size-4" /> Check Seat Availability
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-destructive flex items-center gap-3">
              <Trash className="size-4" /> Delete
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-muted-foreground flex items-center gap-3">
              <Edit className="size-4" /> Edit
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
