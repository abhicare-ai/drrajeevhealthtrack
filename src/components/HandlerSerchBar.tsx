"use client";

import { usePathname } from "next/navigation";
import SerchPatient from "./appointment/search/SerchPatient";

interface HandlerSerchBarProps {
  className?: string;
}
export default function HandlerSerchBar({className}:HandlerSerchBarProps) {
  const pathname = usePathname();
  return <>{pathname === "/appointment/book" ? <SerchPatient className={className}/> : ""}</>;
}
