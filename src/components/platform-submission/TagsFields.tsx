
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { PlatformFormValues } from "./schema";

interface TagsFieldsProps {
  form: UseFormReturn<PlatformFormValues>;
  predefinedTags: string[];
}

const TagsFields: React.FC<TagsFieldsProps> = ({ form, predefinedTags }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tags"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Tags</FormLabel>
              <FormDescription>
                Select tags that best describe the platform
              </FormDescription>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {predefinedTags.map((tag) => (
                <FormField
                  key={tag}
                  control={form.control}
                  name="tags"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={tag}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(tag)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, tag])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== tag
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {tag}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="customTags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Tags</FormLabel>
            <FormControl>
              <Input placeholder="custom, tags, comma, separated" {...field} />
            </FormControl>
            <FormDescription>Add any additional tags not in the list above (comma separated)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TagsFields;
