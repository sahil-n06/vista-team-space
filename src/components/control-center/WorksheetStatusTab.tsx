import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StatusManagementTab = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedWorksheet, setSelectedWorksheet] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: worksheets } = useQuery({
    queryKey: ["worksheets", selectedOrganization],
    queryFn: async () => {
      if (!selectedOrganization) return [];
      const { data, error } = await supabase
        .from("worksheets")
        .select("*")
        .eq("organization_id", selectedOrganization);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrganization,
  });

  const { data: worksheetStatuses } = useQuery({
    queryKey: ["worksheet_statuses", selectedWorksheet],
    queryFn: async () => {
      if (!selectedWorksheet) return [];
      const { data, error } = await supabase
        .from("worksheet_statuses")
        .select("*, statuses(*)")
        .eq("worksheet_id", selectedWorksheet)
        .order("position");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedWorksheet,
  });

  const { data: availableStatuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("statuses").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm({
    resolver: zodResolver(z.object({ status_id: z.string().min(1, "Status is required") })),
    defaultValues: { status_id: "" },
  });

  const addStatusMutation = useMutation({
    mutationFn: async (status_id: string) => {
      const { error } = await supabase.from("worksheet_statuses").insert([
        { worksheet_id: selectedWorksheet, status_id },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheet_statuses"] });
      toast({ title: "Status added to worksheet" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error adding status", description: error.message, variant: "destructive" });
    },
  });

  const removeStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("worksheet_statuses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheet_statuses"] });
      toast({ title: "Status removed from worksheet" });
    },
    onError: (error) => {
      toast({ title: "Error removing status", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (values: { status_id: string }) => {
    addStatusMutation.mutate(values.status_id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Worksheet Status Management</CardTitle>
        <CardDescription>Manage and review statuses for worksheets across departments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Step 1: Select Organization</label>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOrganization && (
            <div>
              <label className="text-sm font-medium mb-2 block">Step 2: Select Worksheet</label>
              <Select value={selectedWorksheet} onValueChange={setSelectedWorksheet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a worksheet" />
                </SelectTrigger>
                <SelectContent>
                  {worksheets?.map((worksheet) => (
                    <SelectItem key={worksheet.id} value={worksheet.id}>
                      {worksheet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedWorksheet && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Worksheet Statuses</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Status to Worksheet</DialogTitle>
                    <DialogDescription>Select a status to add to this worksheet</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableStatuses?.map((status) => (
                                  <SelectItem key={status.id} value={status.id}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: status.color }}
                                      />
                                      {status.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={addStatusMutation.isPending}>
                          Add Status
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {worksheetStatuses?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No statuses assigned to this worksheet
                </div>
              ) : (
                worksheetStatuses?.map((ws) => (
                  <div
                    key={ws.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ws.statuses.color }}
                      />
                      <div>
                        <p className="font-medium">{ws.statuses.name}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {ws.statuses.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStatusMutation.mutate(ws.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusManagementTab;
