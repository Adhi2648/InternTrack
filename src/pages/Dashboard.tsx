import React, { useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import StatusChart from '@/components/dashboard/StatusChart';
import ProgressBar from '@/components/dashboard/ProgressBar';
import ApplicationsTable, { Application } from '@/components/applications/ApplicationsTable';
import UpcomingEvents from '@/components/calendar/UpcomingEvents';
import { FileUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  
  // Sample data for the dashboard
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      companyName: 'Google',
      role: 'Frontend Engineering Intern',
      status: 'applied',
      dateApplied: '2025-04-15',
      nextStep: 'Phone Screen'
    },
    {
      id: '2',
      companyName: 'Microsoft',
      role: 'Software Engineering Intern',
      status: 'interviewing',
      dateApplied: '2025-04-10',
      nextStep: 'Technical Interview'
    },
    {
      id: '3',
      companyName: 'Amazon',
      role: 'Product Management Intern',
      status: 'rejected',
      dateApplied: '2025-04-01',
      nextStep: 'N/A'
    },
    {
      id: '4',
      companyName: 'Meta',
      role: 'Data Science Intern',
      status: 'offer',
      dateApplied: '2025-03-25',
      nextStep: 'Accept Offer'
    }
  ]);

  const upcomingEvents = [
    {
      id: '1',
      title: 'Technical Interview with Google',
      date: '2025-05-10T14:00:00',
      company: 'Google',
      type: 'Technical Interview'
    },
    {
      id: '2',
      title: 'HR Call with Microsoft',
      date: '2025-05-12T11:30:00',
      company: 'Microsoft',
      type: 'HR Interview'
    }
  ];

  // Calculate statistics
  const totalApplications = applications.length;
  const statusCounts = {
    applied: applications.filter(app => app.status === 'applied').length,
    interviewing: applications.filter(app => app.status === 'interviewing').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  // Chart data
  const chartData = [
    { name: 'Applied', value: statusCounts.applied, color: '#D3E4FD' },
    { name: 'Interviewing', value: statusCounts.interviewing, color: '#FEC6A1' },
    { name: 'Offer', value: statusCounts.offer, color: '#F2FCE2' },
    { name: 'Rejected', value: statusCounts.rejected, color: '#FFDEE2' },
  ];

  // Progress stages
  const progressStages = [
    { label: 'Applied', value: statusCounts.applied, color: '#D3E4FD' },
    { label: 'Interviewing', value: statusCounts.interviewing, color: '#FEC6A1' },
    { label: 'Offer', value: statusCounts.offer, color: '#F2FCE2' },
    { label: 'Rejected', value: statusCounts.rejected, color: '#FFDEE2' },
  ];

  // Event handlers
  const handleAddNote = (id: string) => {
    toast({
      title: "Adding note",
      description: `Adding note to application ${id}`,
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus as any } : app
    ));
    
    toast({
      title: "Status updated",
      description: `Application status updated to ${newStatus}`,
    });
  };

  const handleAddApplication = () => {
    toast({
      title: "New application",
      description: "Creating a new application",
    });
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
          />
        </div>
        <div>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
