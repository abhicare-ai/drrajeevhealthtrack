
import { Metadata } from "next";
import ForYouFeed from "./ForYouFeed";

export const metadata: Metadata = {
  title: "Book Appointment",
};
export default function Page() {
  return <ForYouFeed/>
}
