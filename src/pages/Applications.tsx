import ApplicationsTable, {
  Application,
} from "@/components/applications/ApplicationsTable";
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
import { Search } from "lucide-react";
import React, { useState } from "react";

const Applications = () => {
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      companyName: "Google",
      role: "Frontend Engineering Intern",
      status: "applied",
      dateApplied: "2025-04-15",
      nextStep: "Phone Screen",
    },
    {
      id: "2",
      companyName: "Microsoft",
      role: "Software Engineering Intern",
      status: "interviewing",
      dateApplied: "2025-04-10",
      nextStep: "Technical Interview",
    },
    {
      id: "3",
      companyName: "Amazon",
      role: "Product Management Intern",
      status: "rejected",
      dateApplied: "2025-04-01",
      nextStep: "N/A",
    },
    {
      id: "4",
      companyName: "Meta",
      role: "Data Science Intern",
      status: "offer",
      dateApplied: "2025-03-25",
      nextStep: "Accept Offer",
    },
    {
      id: "5",
      companyName: "Apple",
      role: "UX Design Intern",
      status: "applied",
      dateApplied: "2025-04-20",
      nextStep: "Portfolio Review",
    },
    {
      id: "6",
      companyName: "Spotify",
      role: "Backend Engineering Intern",
      status: "interviewing",
      dateApplied: "2025-04-05",
      nextStep: "System Design Interview",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  // Event handlers
  const handleAddNote = (id: string) => {
    toast({
      title: "Adding note",
      description: `Adding note to application ${id}`,
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus as any } : app
      )
    );

    toast({
      title: "Status updated",
      description: `Application status updated to ${newStatus}`,
    });
  };

  const handleAddApplication = () => {
    // open dialog (handled below)
    setShowAddDialog(true);
  };

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // form state for new application
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Application["status"]>("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [nextStep, setNextStep] = useState("");

  const handleCreateApplication = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingApp) {
      const updated: Application = {
        id: editingApp.id,
        companyName: companyName || editingApp.companyName,
        role: role || editingApp.role,
        status,
        dateApplied: dateApplied || editingApp.dateApplied,
        nextStep: nextStep || editingApp.nextStep,
      };
      setApplications((prev) =>
        prev.map((a) => (a.id === editingApp.id ? updated : a))
      );
      toast({
        title: "Application updated",
        description: `${updated.companyName} — ${updated.role}`,
      });
      setEditingApp(null);
    } else {
      const newApp: Application = {
        id: String(Date.now()),
        companyName: companyName || "Untitled",
        role: role || "Unknown Role",
        status: status,
        dateApplied: dateApplied || new Date().toISOString().slice(0, 10),
        nextStep: nextStep || "N/A",
      };
      setApplications((prev) => [newApp, ...prev]);
      toast({
        title: "Application added",
        description: `${newApp.companyName} — ${newApp.role}`,
      });
    }
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
    // show confirmation dialog instead of native confirm
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const filteredApplications =
    activeFilter === "all"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Manage and track all your internship applications.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "applied" ? "default" : "outline"}
            size="sm"
            className="text-blue-800"
            onClick={() => setActiveFilter("applied")}
          >
            Applied
          </Button>
          <Button
            variant={activeFilter === "interviewing" ? "default" : "outline"}
            size="sm"
            className="text-orange-800"
            onClick={() => setActiveFilter("interviewing")}
          >
            Interviewing
          </Button>
          <Button
            variant={activeFilter === "offer" ? "default" : "outline"}
            size="sm"
            className="text-green-800"
            onClick={() => setActiveFilter("offer")}
          >
            Offer
          </Button>
          <Button
            variant={activeFilter === "rejected" ? "default" : "outline"}
            size="sm"
            className="text-red-800"
            onClick={() => setActiveFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-8 w-[200px] sm:w-[300px]"
          />
        </div>
      </div>

      <ApplicationsTable
        applications={filteredApplications}
        onAddNote={handleAddNote}
        onStatusChange={handleStatusChange}
        onAddApplication={handleAddApplication}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Application Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Application</DialogTitle>
            <DialogDescription>
              Create a new internship application and add it to your table.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-3 py-4" onSubmit={handleCreateApplication}>
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

      {/* Delete confirmation dialog */}
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
              onClick={() => {
                if (deletingId) {
                  setApplications((prev) =>
                    prev.filter((a) => a.id !== deletingId)
                  );
                  toast({ title: "Application deleted" });
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
    </div>
  );
};

export default Applications;
