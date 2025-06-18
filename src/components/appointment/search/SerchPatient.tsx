"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, SearchIcon } from "lucide-react";
import { useState } from "react";
import AddNewPatientDialog from "../editor/AddNewPatientDialog";

interface SerchPatientProps {
  className?: string;
}
export default function SerchPatient({ className }: SerchPatientProps) {
  const [showSearchDailog, setShowSearchDialog] = useState(false);
  const [addNewPatientDailog, setAddNewPatientDailog] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        className={cn(
          `shrink-1 justify-start text-left font-normal`,
          className,
        )}
        onClick={() => setShowSearchDialog(true)}
      >
        Search Patient ID, Number, Name
        <SearchIcon className="text-muted-foreground" />
      </Button>

      <Button onClick={() => setAddNewPatientDailog(true)}>
        <Plus /> New Patient
      </Button>

      <AddNewPatientDialog
        onclose={() => setAddNewPatientDailog(false)}
        open={addNewPatientDailog}
      />
    </>
  );
}
