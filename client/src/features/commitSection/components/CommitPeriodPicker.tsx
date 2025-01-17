import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { CommitPeriodProps } from "./CommitOvertimeDashboard";

const DatePickerFormSchema = z.object({
  dateRange: z
    .object({
      from: z.date({
        required_error: "Start date is required",
      }),
      to: z.date(),
    })
    .refine(
      (range) => range.from && range.to,
      "Both start and end dates are required",
    ),
});
type DatePickerProps = z.infer<typeof DatePickerFormSchema>;

interface CommitPeriodPickerProps {
  setCommitPeriod: (commitPeriod: CommitPeriodProps) => void;
  className?: string;
}

export default function CommitPeriodPicker({
  setCommitPeriod,
  className,
}: CommitPeriodPickerProps) {
  const form = useForm<DatePickerProps>({
    resolver: zodResolver(DatePickerFormSchema),
  });

  function onSubmit(data: DatePickerProps) {
    setCommitPeriod({
      since: data.dateRange.from,
      until: data.dateRange.to,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex items-end space-x-3 mb-6", className)}
      >
        <FormField
          name="dateRange"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col items-start w-full">
                <FormLabel>Commit period</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value?.from && field.value?.to ? (
                          `${format(field.value.from, "PPP")} - ${format(
                            field.value.to,
                            "PPP",
                          )}`
                        ) : (
                          <span>Pick a date range</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="bg-primary w-1/2 !px-3 !py-2">
          Search
        </Button>
      </form>
    </Form>
  );
}
