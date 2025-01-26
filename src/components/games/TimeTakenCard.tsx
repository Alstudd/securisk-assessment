import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
  timeEnded: Date | undefined;
  timeStarted: Date;
};

const TimeTakenCard = ({ timeEnded, timeStarted }: Props) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Total Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {timeEnded
            ? formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))
            : "N/A"}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;
