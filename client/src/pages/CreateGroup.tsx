import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGroupSchema } from "@shared/schema";
import { useCreateGroup } from "@/hooks/use-groups";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

// Extend schema for form validation if needed (e.g. coerce numbers)
const formSchema = insertGroupSchema.extend({
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateGroup() {
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateGroup();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      leader: "",
      schedule: "",
      location: "",
      capacity: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    mutate(values, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-8 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-10"
        >
          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
              Start a New Circle
            </h1>
            <p className="text-muted-foreground text-lg">
              Create a space for community, learning, and connection.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Circle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Shabbat Dinner Club" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormDescription>Give your group a welcoming and descriptive name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What will your circle do? Who is it for?" 
                          className="min-h-[120px] resize-none text-base" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="leader"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Leader Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Capacity (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Max members" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2nd Tuesdays, 7pm" {...field} />
                      </FormControl>
                      <FormDescription>When does the group meet?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Community Hall or Zoom" {...field} />
                      </FormControl>
                      <FormDescription>Where will the gathering take place?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Circle"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
}
