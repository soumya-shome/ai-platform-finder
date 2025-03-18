
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PlatformFormValues } from "./schema";

interface FeaturesFieldsProps {
  form: UseFormReturn<PlatformFormValues>;
}

const FeaturesFields: React.FC<FeaturesFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="apiAvailable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
            <div className="space-y-0.5">
              <FormLabel>API Available</FormLabel>
              <FormDescription>Does this platform offer an API?</FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key Features</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List key features, one per line" 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>Enter each feature on a new line</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FeaturesFields;
