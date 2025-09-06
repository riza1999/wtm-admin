"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface PromoFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
}

export function PromoForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
}: PromoFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {/* First Row: Promo Name, Promo Type, Extra Input Based on Promo Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={"name" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promo name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"type" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "discount"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select promo type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="fixed_price">Fixed Price</SelectItem>
                    <SelectItem value="room_upgrade">Room Upgrade</SelectItem>
                    <SelectItem value="benefits">Benefits</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Extra Input Based on Promo Type */}
          {(form.watch("type" as FieldPath<T>) || "discount") ===
            "discount" && (
            <FormField
              control={form.control}
              name={"discount_percentage" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter percentage"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("type" as FieldPath<T>) === "fixed_price" && (
            <FormField
              control={form.control}
              name={"price_discount" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Discount (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("type" as FieldPath<T>) === "room_upgrade" && (
            <FormField
              control={form.control}
              name={"room_upgrade_to" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Upgrade To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="deluxe_room">Deluxe Room</SelectItem>
                      <SelectItem value="superior_room">
                        Superior Room
                      </SelectItem>
                      <SelectItem value="executive_suite">
                        Executive Suite
                      </SelectItem>
                      <SelectItem value="presidential_suite">
                        Presidential Suite
                      </SelectItem>
                      <SelectItem value="business_room">
                        Business Room
                      </SelectItem>
                      <SelectItem value="family_room">Family Room</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("type" as FieldPath<T>) === "benefits" && (
            <FormField
              control={form.control}
              name={"benefits" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter benefits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Second Row: Promo Code, Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={"code" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promo code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promo description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Third Row: Start Date, End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={"start_date" as FieldPath<T>}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date: Date | undefined) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      disabled={(date: Date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"end_date" as FieldPath<T>}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick an end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date: Date | undefined) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      disabled={(date: Date) => {
                        const startDate = form.getValues(
                          "start_date" as FieldPath<T>
                        );
                        if (startDate) {
                          return date <= new Date(startDate);
                        }
                        return date < new Date(new Date().setHours(0, 0, 0, 0));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fourth Row: Hotel Name, Room Type, Bed Type, Nights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name={"hotel_name" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select hotel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ibis_hotel_convention">
                      Ibis Hotel & Convention
                    </SelectItem>
                    <SelectItem value="atria_hotel">Atria Hotel</SelectItem>
                    <SelectItem value="grand_hyatt_jakarta">
                      Grand Hyatt Jakarta
                    </SelectItem>
                    <SelectItem value="ritz_carlton_jakarta">
                      The Ritz-Carlton Jakarta
                    </SelectItem>
                    <SelectItem value="hotel_indonesia_kempinski">
                      Hotel Indonesia Kempinski
                    </SelectItem>
                    <SelectItem value="fairmont_jakarta">
                      Fairmont Jakarta
                    </SelectItem>
                    <SelectItem value="jw_marriott_jakarta">
                      JW Marriott Hotel Jakarta
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"room_type" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard_room">Standard Room</SelectItem>
                    <SelectItem value="superior_room">Superior Room</SelectItem>
                    <SelectItem value="deluxe_room">Deluxe Room</SelectItem>
                    <SelectItem value="executive_suite">
                      Executive Suite
                    </SelectItem>
                    <SelectItem value="presidential_suite">
                      Presidential Suite
                    </SelectItem>
                    <SelectItem value="business_room">Business Room</SelectItem>
                    <SelectItem value="family_room">Family Room</SelectItem>
                    <SelectItem value="ocean_view_room">
                      Ocean View Room
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"bed_type" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bed type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single_bed">Single Bed</SelectItem>
                    <SelectItem value="twin_bed">Twin Bed</SelectItem>
                    <SelectItem value="double_bed">Double Bed</SelectItem>
                    <SelectItem value="queen_size">Queen Size</SelectItem>
                    <SelectItem value="king_size">King Size</SelectItem>
                    <SelectItem value="2_king_size">2 King Size</SelectItem>
                    <SelectItem value="sofa_bed">Sofa Bed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"nights" as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nights</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter nights"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fifth Row: Active Status */}
        <div className="grid grid-cols-1">
          <FormField
            control={form.control}
            name={"status" as FieldPath<T>}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable this promo
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {children}
      </form>
    </Form>
  );
}
