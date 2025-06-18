"use client";

import { useEffect, useState } from "react";
import BreadcrumbBookAppt from "@/app/(main)/appointment/book/BreadcrumbBookAppt";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function BreadcrumbMain() {
  const pathname = usePathname();

  // Regex se patientId nikaalo
  const match = pathname.match(
    /^\/appointment\/book\/schedule-appointment\/([^/]+)$/,
  );
  const patientId = match ? match[1] : null;

  // Patient name fetch karne ke liye state
  const [patientName, setPatientName] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetch(`/api/breadcrum-for-pataient?id=${patientId}`)
        .then((res) => res.json())
        .then((data) => setPatientName(data?.patientName ?? patientId))
        .catch(() => setPatientName(patientId));
    }
  }, [patientId]);

  return (
    <>
      {pathname === "/appointment/book" ? (
        <BreadcrumbBookAppt />
      ) : patientId ? (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Appointment</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link href="/appointment/book">Book Appointment</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{patientName ?? patientId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        ""
      )}
    </>
  );
}
