import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarClock, Edit, Plus, Trash2 } from "lucide-react";
import React from "react";

export interface Application {
  id: string;
  companyName: string;
  role: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  dateApplied: string;
  nextStep: string;
  eventDate?: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onAddNote?: (id: string) => void;
  onStatusChange?: (id: string, status: Application["status"]) => void;
  onAddApplication?: () => void;
  onEdit?: (app: Application) => void;
  onDelete?: (id: string) => void;
  onLogEvent?: (app: Application) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onAddNote,
  onStatusChange,
  onAddApplication,
  onEdit,
  onDelete,
  onLogEvent,
}) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Helper function to render status badge
  const renderStatus = (status: Application["status"]) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      applied: { label: "Applied", className: "status-applied" },
      interviewing: { label: "Interviewing", className: "status-interviewing" },
      offer: { label: "Offer", className: "status-offer" },
      rejected: { label: "Rejected", className: "status-rejected" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "status-unknown",
    };
    const { label, className } = statusInfo;

    return (
      <Badge variant="outline" className={`status-pill ${className}`}>
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Applications</CardTitle>
        <Button size="sm" onClick={onAddApplication}>
          <Plus className="h-4 w-4 mr-1" /> Add Application
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Company</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">
                  Date Applied
                </TableHead>
                <TableHead className="whitespace-nowrap">Next Step</TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {app.companyName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {app.role}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {renderStatus(app.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(app.id, "applied")}
                        >
                          Applied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange?.(app.id, "interviewing")
                          }
                        >
                          Interviewing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(app.id, "offer")}
                        >
                          Offer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(app.id, "rejected")}
                        >
                          Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(app.dateApplied)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {app.nextStep}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex"
                      onClick={() => onLogEvent?.(app)}
                    >
                      <CalendarClock className="h-3.5 w-3.5 mr-1" /> Log Event
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8"
                      variant="outline"
                      onClick={() => onEdit?.(app)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8"
                      variant="destructive"
                      onClick={() => onDelete?.(app.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
