"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/types/data-table";
import type * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface AddMemberPromoGroupFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  companyOptions: Option[];
  memberOptions: Option[];
  onCompanyChange: (companyLabel: string) => void;
}

export function AddMemberPromoGroupForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  companyOptions,
  memberOptions,
  onCompanyChange,
}: AddMemberPromoGroupFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={"company" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Company</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    onCompanyChange(val);
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select agent company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map((opt) => (
                      <SelectItem key={opt.label} value={opt.label}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"memberId" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select member name" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
