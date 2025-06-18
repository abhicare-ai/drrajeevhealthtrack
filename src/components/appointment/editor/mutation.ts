import { AppoinmentsPage } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { appoinment } from "./actions";
import { toast } from "sonner";

export function useSubmitAppointmetsMutaion() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: appoinment,
    onSuccess: async (newAppt) => {
      const quryFilter = { queryKey: ["appointmet-feed", "for-you"] };

      await queryClient.cancelQueries(quryFilter);

      //case update
      queryClient.setQueriesData<InfiniteData<AppoinmentsPage, string | null>>(
        quryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  appoinments: [newAppt, ...firstPage.appoinments],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: quryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast("Appointment created successfully!");
    },
    onError(error) {
      console.log(error);
      toast("Failed to create appointment. Please try again.");
    },
  });

  return mutation;
}
