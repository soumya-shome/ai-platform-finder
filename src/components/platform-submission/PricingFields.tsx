
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PlatformFormValues } from "./schema";

interface PricingFieldsProps {
  form: UseFormReturn<PlatformFormValues>;
}

const PricingFields: React.FC<PricingFieldsProps> = ({ form }) => {
  const watchHasFree = form.watch("pricing.hasFree");
  const watchHasPaid = form.watch("pricing.hasPaid");

  return (
    <div className="space-y-4 rounded-md border p-4">
      <h3 className="text-lg font-medium">Pricing Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pricing.hasFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Free Tier Available</FormLabel>
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
        
        <FormField
          control={form.control}
          name="pricing.hasPaid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Paid Plans Available</FormLabel>
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
      
      {watchHasFree && (
        <FormField
          control={form.control}
          name="pricing.freeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Free Tier Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the free tier limitations and features..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {watchHasPaid && (
        <FormField
          control={form.control}
          name="pricing.startingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Price</FormLabel>
              <FormControl>
                <Input placeholder="$9.99/month" {...field} />
              </FormControl>
              <FormDescription>Enter the starting price for paid plans</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default PricingFields;
