import { Button } from "@/components/ui/button";

interface TokenSheetProps {
  tokennumber: string | null;
}

const elevenToTwelve = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const twelveToOne = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const oneToTwo = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40,
];
const fourToFive = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
const fiveToSix = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const sixToSeven = [
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100, 101, 102, 103, 104, 105,
];
export default function TokenSheet({ tokennumber }: TokenSheetProps) {
  return (
    <>
      {tokennumber === "11:00AM - 12:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {elevenToTwelve.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : tokennumber === "12:00PM - 01:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {twelveToOne.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : tokennumber === "01:00PM - 02:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {oneToTwo.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : tokennumber === "04:00PM - 05:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {fourToFive.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : tokennumber === "05:00PM - 06:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {fiveToSix.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : tokennumber === "06:00PM - 07:00PM" ? (
        <div className="space-x-5 space-y-5 ">
          {sixToSeven.map((v) => (
            <Button variant="secondary" className="w-fit cursor-default" key={v}>
              {v}
            </Button>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
