"use client";

import InfinitScrollContainer from "@/components/InfinitScrollContainer";

import kyInstance from "@/lib/ky";
import { AppoinmentsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import AppointmetSkelaton from "./AppointmetSkelaton";
import TableShowData from "@/components/appointment/TableShowData";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["appointmet-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/appointment/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<AppoinmentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.appoinments) || [];
  if (status === "pending") {
    return <AppointmetSkelaton />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        No appointments faund.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading appointments.
      </p>
    );
  }

  return (
    <InfinitScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <TableShowData apptData={posts} />

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfinitScrollContainer>
  );
}
