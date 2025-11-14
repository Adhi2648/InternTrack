import ApplicationsTable, {
  Application,
} from "@/components/applications/ApplicationsTable";
import UpcomingEvents from "@/components/calendar/UpcomingEvents";
import ProgressBar from "@/components/dashboard/ProgressBar";
import StatCard from "@/components/dashboard/StatCard";
import StatusChart from "@/components/dashboard/StatusChart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import useApplications from "@/hooks/useApplications";
import { Calendar, CheckCircle, Clock, FileUp } from "lucide-react";
import React, { useState } from "react";

const Dashboard = () => {
  // All hooks at top to prevent conditional hook ordering issues
  const { toast } = useToast();
  const appsQuery = useApplications();
  const applications = (appsQuery.data ?? []) as Application[];
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<Application | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [status, setStatus] = React.useState<Application["status"]>("applied");
  const [dateApplied, setDateApplied] = React.useState("");
  const [nextStep, setNextStep] = React.useState("");

  if (appsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (appsQuery.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">
            Failed to load applications
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {(appsQuery.error as any)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Generate upcoming events from applications with nextStep values
  const upcomingEvents = applications
    .filter((app) => app.nextStep && app.nextStep.trim().length > 0)
    .map((app) => ({
      id: app.id,
      title: `${app.nextStep} - ${app.role}`,
      date: new Date().toISOString(), // Use current date as base; can be enhanced with actual event dates
      company: app.companyName,
      type: app.nextStep,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate statistics
  const totalApplications = applications.length;
  const statusCounts = {
    applied: applications.filter((app) => app.status === "applied").length,
    interviewing: applications.filter((app) => app.status === "interviewing")
      .length,
    offer: applications.filter((app) => app.status === "offer").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  // Chart data
  const chartData = [
    { name: "Applied", value: statusCounts.applied, color: "#D3E4FD" },
    {
      name: "Interviewing",
      value: statusCounts.interviewing,
      color: "#FEC6A1",
    },
    { name: "Offer", value: statusCounts.offer, color: "#F2FCE2" },
    { name: "Rejected", value: statusCounts.rejected, color: "#FFDEE2" },
  ];

  // Progress stages
  const progressStages = [
    { label: "Applied", value: statusCounts.applied, color: "#D3E4FD" },
    {
      label: "Interviewing",
      value: statusCounts.interviewing,
      color: "#FEC6A1",
    },
    { label: "Offer", value: statusCounts.offer, color: "#F2FCE2" },
    { label: "Rejected", value: statusCounts.rejected, color: "#FFDEE2" },
  ];

  // Event handlers
  const handleAddNote = (id: string) => {
    toast({
      title: "Adding note",
      description: `Adding note to application ${id}`,
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    (async () => {
      try {
        await appsQuery.update.mutateAsync({
          id,
          payload: { status: newStatus },
        });
        toast({
          title: "Status updated",
          description: `Application status updated to ${newStatus}`,
        });
      } catch (err) {
        toast({ title: "Error", description: "Failed to update status" });
      }
    })();
  };

  const handleAddApplication = () => {
    // open add application dialog
    setShowAddDialog(true);
  };

  const handleCreateApplication = (e?: React.FormEvent) => {
    e?.preventDefault();
    (async () => {
      try {
        if (editingApp) {
          await appsQuery.update.mutateAsync({
            id: editingApp.id,
            payload: { companyName, role, status, dateApplied, nextStep },
          });
          toast({
            title: "Application updated",
            description: `${companyName} — ${role}`,
          });
          setEditingApp(null);
        } else {
          await appsQuery.create.mutateAsync({
            companyName,
            role,
            status,
            dateApplied: dateApplied || new Date().toISOString().slice(0, 10),
            nextStep,
          });
          toast({
            title: "Application added",
            description: `${companyName} — ${role}`,
          });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to save application" });
      }
    })();
    // reset form and close
    setCompanyName("");
    setRole("");
    setStatus("applied");
    setDateApplied("");
    setNextStep("");
    setShowAddDialog(false);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setCompanyName(app.companyName);
    setRole(app.role);
    setStatus(app.status);
    setDateApplied(app.dateApplied);
    setNextStep(app.nextStep);
    setShowAddDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage your internship applications.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={<FileUp className="h-4 w-4" />}
        />
        <StatCard
          title="Active Applications"
          value={statusCounts.applied + statusCounts.interviewing}
          description="Applied or interviewing"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Offers Received"
          value={statusCounts.offer}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ProgressBar stages={progressStages} total={totalApplications} />
        <StatusChart data={chartData} />
      </div>

      {/* Applications and calendar */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ApplicationsTable
            applications={applications}
            onAddNote={handleAddNote}
            onStatusChange={handleStatusChange}
            onAddApplication={handleAddApplication}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        {/* Delete confirmation dialog for Dashboard */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this application? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeletingId(null);
                }}
              >
                No
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deletingId) {
                    try {
                      await appsQuery.remove.mutateAsync(deletingId);
                      toast({ title: "Application deleted" });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to delete",
                      });
                    }
                  }
                  setShowDeleteDialog(false);
                  setDeletingId(null);
                }}
              >
                Yes, delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Add Application Dialog on Dashboard */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Application</DialogTitle>
              <DialogDescription>
                Create a new internship application and add it to your dashboard
                table.
              </DialogDescription>
            </DialogHeader>

            <form
              className="grid gap-3 py-4"
              onSubmit={handleCreateApplication}
            >
              <label className="flex flex-col">
                <span className="text-sm">Company</span>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Role</span>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-sm">Status</span>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as Application["status"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm">Date Applied</span>
                  <Input
                    type="date"
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                  />
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm">Next Step</span>
                <Input
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                />
              </label>

              <DialogFooter>
                <div className="flex w-full justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Application</Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <div>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
