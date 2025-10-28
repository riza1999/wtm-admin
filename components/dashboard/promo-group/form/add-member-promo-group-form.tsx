"use client";

import { getAgentByCompanyId } from "@/app/(dashboard)/promo-group/fetch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/types/data-table";
import { useQuery } from "@tanstack/react-query";
import type * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

interface AddMemberPromoGroupFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  companyOptions: Option[];
  onCompanyChange: (companyLabel: string) => void;
}

export function AddMemberPromoGroupForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  companyOptions,
  onCompanyChange,
}: AddMemberPromoGroupFormProps<T>) {
  const selectedCompany = form.watch("company" as FieldPath<T>);
  const {
    data: agentOptions,
    isLoading: isLoadingAgents,
    isError: isErrorAgents,
  } = useQuery({
    queryKey: ["bed-type-options", selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      return getAgentByCompanyId(selectedCompany);
    },
    enabled: !!selectedCompany,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

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
                      <SelectItem key={opt.label} value={opt.value}>
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingAgents || !selectedCompany}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    {isLoadingAgents && selectedCompany ? (
                      <div className="flex items-center">
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Loading member Names...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select member Name" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingAgents && selectedCompany ? (
                    <SelectItem value="loading" disabled>
                      Loading member Names...
                    </SelectItem>
                  ) : isErrorAgents ? (
                    <SelectItem value="error" disabled>
                      Failed to load member Names
                    </SelectItem>
                  ) : agentOptions && agentOptions.length > 0 ? (
                    agentOptions.map((agent) => (
                      <SelectItem key={agent.value} value={agent.value}>
                        {agent.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-bed-types" disabled>
                      {selectedCompany
                        ? "No member names available"
                        : "Select a room type first"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
