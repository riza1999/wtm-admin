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

interface AddAgentCompanyFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  companyOptions: Option[];
}

export function AddAgentCompanyForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  companyOptions,
}: AddAgentCompanyFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={"agent_company_id" as FieldPath<T>}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Agent Company</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
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

                {/* Preview selected company members */}
                {/* {selectedCompany && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                      Members from {selectedCompany}:
                    </h4>
                    {companyMembers.length > 0 ? (
                      <ol className="space-y-1 list-decimal list-inside">
                        {companyMembers.map((member) => (
                          <li
                            key={member.id}
                            className="text-sm text-muted-foreground"
                          >
                            {member.name}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No members found for this company.
                      </p>
                    )}
                  </div>
                )} */}
              </FormItem>
            );
          }}
        />
        {children}
      </form>
    </Form>
  );
}
