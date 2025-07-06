"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", confirmed: 222, rejected: 150 },
  { date: "2024-04-02", confirmed: 97, rejected: 180 },
  { date: "2024-04-03", confirmed: 167, rejected: 120 },
  { date: "2024-04-04", confirmed: 242, rejected: 260 },
  { date: "2024-04-05", confirmed: 373, rejected: 290 },
  { date: "2024-04-06", confirmed: 301, rejected: 340 },
  { date: "2024-04-07", confirmed: 245, rejected: 180 },
  { date: "2024-04-08", confirmed: 409, rejected: 320 },
  { date: "2024-04-09", confirmed: 59, rejected: 110 },
  { date: "2024-04-10", confirmed: 261, rejected: 190 },
  { date: "2024-04-11", confirmed: 327, rejected: 350 },
  { date: "2024-04-12", confirmed: 292, rejected: 210 },
  { date: "2024-04-13", confirmed: 342, rejected: 380 },
  { date: "2024-04-14", confirmed: 137, rejected: 220 },
  { date: "2024-04-15", confirmed: 120, rejected: 170 },
  { date: "2024-04-16", confirmed: 138, rejected: 190 },
  { date: "2024-04-17", confirmed: 446, rejected: 360 },
  { date: "2024-04-18", confirmed: 364, rejected: 410 },
  { date: "2024-04-19", confirmed: 243, rejected: 180 },
  { date: "2024-04-20", confirmed: 89, rejected: 150 },
  { date: "2024-04-21", confirmed: 137, rejected: 200 },
  { date: "2024-04-22", confirmed: 224, rejected: 170 },
  { date: "2024-04-23", confirmed: 138, rejected: 230 },
  { date: "2024-04-24", confirmed: 387, rejected: 290 },
  { date: "2024-04-25", confirmed: 215, rejected: 250 },
  { date: "2024-04-26", confirmed: 75, rejected: 130 },
  { date: "2024-04-27", confirmed: 383, rejected: 420 },
  { date: "2024-04-28", confirmed: 122, rejected: 180 },
  { date: "2024-04-29", confirmed: 315, rejected: 240 },
  { date: "2024-04-30", confirmed: 454, rejected: 380 },
  { date: "2024-05-01", confirmed: 165, rejected: 220 },
  { date: "2024-05-02", confirmed: 293, rejected: 310 },
  { date: "2024-05-03", confirmed: 247, rejected: 190 },
  { date: "2024-05-04", confirmed: 385, rejected: 420 },
  { date: "2024-05-05", confirmed: 481, rejected: 390 },
  { date: "2024-05-06", confirmed: 498, rejected: 520 },
  { date: "2024-05-07", confirmed: 388, rejected: 300 },
  { date: "2024-05-08", confirmed: 149, rejected: 210 },
  { date: "2024-05-09", confirmed: 227, rejected: 180 },
  { date: "2024-05-10", confirmed: 293, rejected: 330 },
  { date: "2024-05-11", confirmed: 335, rejected: 270 },
  { date: "2024-05-12", confirmed: 197, rejected: 240 },
  { date: "2024-05-13", confirmed: 197, rejected: 160 },
  { date: "2024-05-14", confirmed: 448, rejected: 490 },
  { date: "2024-05-15", confirmed: 473, rejected: 380 },
  { date: "2024-05-16", confirmed: 338, rejected: 400 },
  { date: "2024-05-17", confirmed: 499, rejected: 420 },
  { date: "2024-05-18", confirmed: 315, rejected: 350 },
  { date: "2024-05-19", confirmed: 235, rejected: 180 },
  { date: "2024-05-20", confirmed: 177, rejected: 230 },
  { date: "2024-05-21", confirmed: 82, rejected: 140 },
  { date: "2024-05-22", confirmed: 81, rejected: 120 },
  { date: "2024-05-23", confirmed: 252, rejected: 290 },
  { date: "2024-05-24", confirmed: 294, rejected: 220 },
  { date: "2024-05-25", confirmed: 201, rejected: 250 },
  { date: "2024-05-26", confirmed: 213, rejected: 170 },
  { date: "2024-05-27", confirmed: 420, rejected: 460 },
  { date: "2024-05-28", confirmed: 233, rejected: 190 },
  { date: "2024-05-29", confirmed: 78, rejected: 130 },
  { date: "2024-05-30", confirmed: 340, rejected: 280 },
  { date: "2024-05-31", confirmed: 178, rejected: 230 },
  { date: "2024-06-01", confirmed: 178, rejected: 200 },
  { date: "2024-06-02", confirmed: 470, rejected: 410 },
  { date: "2024-06-03", confirmed: 103, rejected: 160 },
  { date: "2024-06-04", confirmed: 439, rejected: 380 },
  { date: "2024-06-05", confirmed: 88, rejected: 140 },
  { date: "2024-06-06", confirmed: 294, rejected: 250 },
  { date: "2024-06-07", confirmed: 323, rejected: 370 },
  { date: "2024-06-08", confirmed: 385, rejected: 320 },
  { date: "2024-06-09", confirmed: 438, rejected: 480 },
  { date: "2024-06-10", confirmed: 155, rejected: 200 },
  { date: "2024-06-11", confirmed: 92, rejected: 150 },
  { date: "2024-06-12", confirmed: 492, rejected: 420 },
  { date: "2024-06-13", confirmed: 81, rejected: 130 },
  { date: "2024-06-14", confirmed: 426, rejected: 380 },
  { date: "2024-06-15", confirmed: 307, rejected: 350 },
  { date: "2024-06-16", confirmed: 371, rejected: 310 },
  { date: "2024-06-17", confirmed: 475, rejected: 520 },
  { date: "2024-06-18", confirmed: 107, rejected: 170 },
  { date: "2024-06-19", confirmed: 341, rejected: 290 },
  { date: "2024-06-20", confirmed: 408, rejected: 450 },
  { date: "2024-06-21", confirmed: 169, rejected: 210 },
  { date: "2024-06-22", confirmed: 317, rejected: 270 },
  { date: "2024-06-23", confirmed: 480, rejected: 530 },
  { date: "2024-06-24", confirmed: 132, rejected: 180 },
  { date: "2024-06-25", confirmed: 141, rejected: 190 },
  { date: "2024-06-26", confirmed: 434, rejected: 380 },
  { date: "2024-06-27", confirmed: 448, rejected: 490 },
  { date: "2024-06-28", confirmed: 149, rejected: 200 },
  { date: "2024-06-29", confirmed: 103, rejected: 160 },
  { date: "2024-06-30", confirmed: 446, rejected: 400 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--chart-2)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Bookings</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <Area
              dataKey="confirmed"
              type="natural"
              fill="url(#fillConfirmed)"
              stroke="var(--color-confirmed)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
