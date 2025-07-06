"use client";

// import type { Task } from "@/db/schema";
import * as React from "react";

import { Report } from "@/app/(dashboard)/report/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

interface DetailReportDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  report: Report | null;
  onSuccess?: () => void;
}

export function DetailReportDialog({
  report,
  onSuccess,
  ...props
}: DetailReportDialogProps) {
  if (!report) return;

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Report Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Report Information */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Agent Name
                </p>
                <p className="text-sm capitalize">{report.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Company
                </p>
                <p className="text-sm capitalize">{report.company}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">{report.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hotel Name
                </p>
                <p className="text-sm">{report.hotel_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    report.status === "approved" ? "default" : "destructive"
                  }
                  className="capitalize"
                >
                  {report.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings ({report.bookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.bookings.map((booking, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Guest Name
                        </p>
                        <p className="text-sm capitalize">
                          {booking.guest_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Room Type
                        </p>
                        <p className="text-sm capitalize">
                          {booking.room_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Check-in
                        </p>
                        <p className="text-sm">{formatDate(booking.date_in)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Check-out
                        </p>
                        <p className="text-sm">
                          {formatDate(booking.date_out)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Capacity
                        </p>
                        <p className="text-sm">{booking.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Additional
                        </p>
                        <p className="text-sm capitalize">
                          {booking.additional || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
