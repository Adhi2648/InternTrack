
import React, { useState } from 'react';
import ApplicationsTable, { Application } from '@/components/applications/ApplicationsTable';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Applications = () => {
  const { toast } = useToast();
  
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
    },
    {
      id: '5',
      companyName: 'Apple',
      role: 'UX Design Intern',
      status: 'applied',
      dateApplied: '2025-04-20',
      nextStep: 'Portfolio Review'
    },
    {
      id: '6',
      companyName: 'Spotify',
      role: 'Backend Engineering Intern',
      status: 'interviewing',
      dateApplied: '2025-04-05',
      nextStep: 'System Design Interview'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

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

  const filteredApplications = activeFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeFilter);

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
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'applied' ? 'default' : 'outline'} 
            size="sm"
            className="text-blue-800"
            onClick={() => setActiveFilter('applied')}
          >
            Applied
          </Button>
          <Button 
            variant={activeFilter === 'interviewing' ? 'default' : 'outline'} 
            size="sm"
            className="text-orange-800"
            onClick={() => setActiveFilter('interviewing')}
          >
            Interviewing
          </Button>
          <Button 
            variant={activeFilter === 'offer' ? 'default' : 'outline'} 
            size="sm"
            className="text-green-800"
            onClick={() => setActiveFilter('offer')}
          >
            Offer
          </Button>
          <Button 
            variant={activeFilter === 'rejected' ? 'default' : 'outline'} 
            size="sm"
            className="text-red-800"
            onClick={() => setActiveFilter('rejected')}
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
      />
    </div>
  );
};

export default Applications;
