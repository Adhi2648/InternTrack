
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload, Link, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Resume {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  usedBy: {
    company: string;
    role: string;
  }[];
}

const Resumes = () => {
  // Sample resumes data
  const resumes: Resume[] = [
    {
      id: '1',
      name: 'Software Engineering Resume',
      version: 'v2.1',
      updatedAt: '2025-04-15',
      usedBy: [
        { company: 'Google', role: 'Frontend Engineering Intern' },
        { company: 'Microsoft', role: 'Software Engineering Intern' }
      ]
    },
    {
      id: '2',
      name: 'Product Management Resume',
      version: 'v1.3',
      updatedAt: '2025-04-10',
      usedBy: [
        { company: 'Amazon', role: 'Product Management Intern' }
      ]
    },
    {
      id: '3',
      name: 'Data Science Resume',
      version: 'v2.0',
      updatedAt: '2025-04-05',
      usedBy: [
        { company: 'Meta', role: 'Data Science Intern' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume Tracker</h1>
        <p className="text-muted-foreground">
          Manage different versions of your resume and track which ones you've used for applications.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">My Resumes</h2>
          <p className="text-sm text-muted-foreground">
            {resumes.length} resume versions
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Link className="h-4 w-4 mr-1" /> Link Resume
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-1" /> Upload New
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-medium">{resume.name}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="mr-2">{resume.version}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> 
                      {resume.updatedAt}
                    </span>
                  </div>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="text-sm font-medium mb-2">Used for:</h4>
                <div className="space-y-1.5">
                  {resume.usedBy.map((app, index) => (
                    <div key={index} className="text-xs px-3 py-1.5 bg-muted rounded-md">
                      <span className="font-medium">{app.company}</span> • {app.role}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="w-full">View Resume</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add new resume card */}
        <Card className="flex flex-col justify-center items-center p-8 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Add New Resume</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Upload or link to a new resume version
          </p>
          <Button size="sm">Add Resume</Button>
        </Card>
      </div>
    </div>
  );
};

export default Resumes;
