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
}

interface ApplicationsTableProps {
  applications: Application[];
  onAddNote?: (id: string) => void;
  onStatusChange?: (id: string, status: Application["status"]) => void;
  onAddApplication?: () => void;
  onEdit?: (app: Application) => void;
  onDelete?: (id: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onAddNote,
  onStatusChange,
  onAddApplication,
  onEdit,
  onDelete,
}) => {
  // Helper function to render status badge
  const renderStatus = (status: Application["status"]) => {
    const statusMap = {
      applied: { label: "Applied", className: "status-applied" },
      interviewing: { label: "Interviewing", className: "status-interviewing" },
      offer: { label: "Offer", className: "status-offer" },
      rejected: { label: "Rejected", className: "status-rejected" },
    };

    const { label, className } = statusMap[status];

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
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Next Step</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {app.companyName}
                  </TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>
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
                  <TableCell>{app.dateApplied}</TableCell>
                  <TableCell>{app.nextStep}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddNote?.(app.id)}
                    >
                      <CalendarClock className="h-3.5 w-3.5 mr-1" /> Log Event
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit?.(app)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
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
