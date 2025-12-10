import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useResumes, { Resume } from "@/hooks/useResumes";
import {
  Calendar,
  ChevronRight,
  Edit3,
  File,
  FileText,
  FolderOpen,
  HardDrive,
  MoreVertical,
  Plus,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

const Resumes = () => {
  const {
    resumes,
    isLoading,
    createResume,
    updateResume,
    deleteResume,
    isCreating,
  } = useResumes();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    version: "v1.0",
    filePath: "",
    description: "",
    tags: "",
    isDefault: false,
  });

  // Default resume templates that can be configured
  const defaultTemplates = [
    {
      id: "template-swe",
      name: "Software Engineering Resume",
      version: "v2.1",
      description: "Tailored for SWE and frontend/backend roles",
      tags: ["software", "engineering", "tech"],
      filePath: "",
      isTemplate: true,
    },
    {
      id: "template-pm",
      name: "Product Management Resume",
      version: "v1.3",
      description: "For PM and product-focused roles",
      tags: ["product", "management", "strategy"],
      filePath: "",
      isTemplate: true,
    },
    {
      id: "template-ds",
      name: "Data Science Resume",
      version: "v2.0",
      description: "For data science and ML roles",
      tags: ["data", "science", "ML", "analytics"],
      filePath: "",
      isTemplate: true,
    },
  ];

  // Combine real resumes with unconfigured templates
  const allResumes = [
    ...resumes,
    ...defaultTemplates.filter(
      (template) => !resumes.some((r) => r.name === template.name)
    ),
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      version: "v1.0",
      filePath: "",
      description: "",
      tags: "",
      isDefault: false,
    });
  };

  const handleAddResume = async () => {
    if (!formData.name || !formData.filePath) {
      toast({
        title: "Missing fields",
        description: "Please provide a name and file path.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createResume({
        name: formData.name,
        version: formData.version,
        filePath: formData.filePath,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isDefault: formData.isDefault,
      });
      toast({
        title: "Resume added",
        description: "Your resume has been saved successfully.",
      });
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditResume = async () => {
    if (!selectedResume || !formData.name || !formData.filePath) {
      toast({
        title: "Missing fields",
        description: "Please provide a name and file path.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateResume({
        _id: selectedResume._id,
        name: formData.name,
        version: formData.version,
        filePath: formData.filePath,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isDefault: formData.isDefault,
      });
      toast({
        title: "Resume updated",
        description: "Your changes have been saved.",
      });
      setShowEditDialog(false);
      setSelectedResume(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResume = async () => {
    if (!selectedResume) return;

    try {
      await deleteResume(selectedResume._id);
      toast({
        title: "Resume deleted",
        description: "The resume has been removed.",
      });
      setShowDeleteDialog(false);
      setSelectedResume(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (resume: Resume | (typeof defaultTemplates)[0]) => {
    // Check if it's a template (has isTemplate property) or a real resume
    const isTemplate = "isTemplate" in resume && resume.isTemplate;

    if (isTemplate) {
      // For templates, we'll create a new resume with pre-filled info
      setSelectedResume(null);
      setFormData({
        name: resume.name,
        version: resume.version,
        filePath: "",
        description: resume.description || "",
        tags: resume.tags?.join(", ") || "",
        isDefault: false,
      });
      setShowAddDialog(true); // Use add dialog to create from template
    } else {
      // For existing resumes, edit as normal
      setSelectedResume(resume as Resume);
      setFormData({
        name: resume.name,
        version: resume.version,
        filePath: resume.filePath,
        description: (resume as Resume).description || "",
        tags: resume.tags?.join(", ") || "",
        isDefault: (resume as Resume).isDefault,
      });
      setShowEditDialog(true);
    }
  };

  const openDeleteDialog = (resume: Resume) => {
    setSelectedResume(resume);
    setShowDeleteDialog(true);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not configured";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-5 w-5" />;
    if (ext === "doc" || ext === "docx") return <File className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const defaultResume = resumes.find((r) => r.isDefault);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Resume Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your resumes and track which versions you've used
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Resume
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Resumes</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {resumes.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Times Used</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {resumes.reduce((acc, r) => acc + (r.usedBy?.length || 0), 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Default Resume</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">
                  {defaultResume?.name?.split(" ")[0] || "None"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Latest Update</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {resumes.length > 0 ? formatDate(resumes[0]?.updatedAt) : "—"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allResumes.map((resume) => {
          const isTemplate = "isTemplate" in resume && resume.isTemplate;
          const isConfigured = !isTemplate;

          return (
            <Card
              key={isTemplate ? resume.id : resume._id}
              className={`group relative overflow-hidden transition-all hover:shadow-lg ${
                isConfigured && (resume as Resume).isDefault
                  ? "ring-2 ring-primary"
                  : ""
              } ${
                isTemplate
                  ? "border-dashed border-2 border-muted-foreground/30"
                  : ""
              }`}
            >
              {isConfigured && (resume as Resume).isDefault && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium rounded-bl-lg">
                  Default
                </div>
              )}

              {isTemplate && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-0.5 text-xs font-medium rounded-bl-lg">
                  Template
                </div>
              )}

              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        isTemplate
                          ? "bg-gradient-to-br from-amber-500/20 to-amber-600/5"
                          : "bg-gradient-to-br from-primary/20 to-primary/5"
                      }`}
                    >
                      {getFileIcon(resume.filePath || "")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base leading-tight">
                        {resume.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {resume.version}
                        </Badge>
                        {isConfigured && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate((resume as Resume).updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isConfigured && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(resume)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(resume as Resume)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* File Path or Configure Prompt */}
                {isConfigured && resume.filePath ? (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <HardDrive className="h-3 w-3" />
                      <span>File Location</span>
                    </div>
                    <p
                      className="text-sm font-mono truncate"
                      title={resume.filePath}
                    >
                      {resume.filePath}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-1">
                      <HardDrive className="h-3 w-3" />
                      <span>Not Configured</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to add file path
                    </p>
                  </div>
                )}

                {/* Description */}
                {resume.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {resume.description}
                  </p>
                )}

                {/* Tags */}
                {resume.tags && resume.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resume.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Used By - only for configured resumes */}
                {isConfigured &&
                  (resume as Resume).usedBy &&
                  (resume as Resume).usedBy.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Used for {(resume as Resume).usedBy.length} application
                        {(resume as Resume).usedBy.length > 1 ? "s" : ""}
                      </p>
                      <div className="space-y-1.5">
                        {(resume as Resume).usedBy
                          .slice(0, 2)
                          .map((app, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="font-medium">{app.company}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground truncate">
                                {app.role}
                              </span>
                            </div>
                          ))}
                        {(resume as Resume).usedBy.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{(resume as Resume).usedBy.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Button */}
                {isConfigured ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 gap-2"
                    onClick={() => {
                      toast({
                        title: "File path copied",
                        description: "Open the file from your file explorer.",
                      });
                      navigator.clipboard.writeText(resume.filePath);
                    }}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Copy Path
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-4 gap-2"
                    onClick={() => openEditDialog(resume)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Configure Path
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Card */}
        <Card
          className="flex flex-col items-center justify-center p-8 border-dashed border-2 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer min-h-[280px]"
          onClick={() => setShowAddDialog(true)}
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">Add New Resume</h3>
          <p className="text-sm text-muted-foreground text-center">
            Save your resume path for quick access
          </p>
        </Card>
      </div>

      {/* Add Resume Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Add New Resume
            </DialogTitle>
            <DialogDescription>
              Save the path to your resume file on your computer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Resume Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Software Engineering Resume"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="v1.0"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-6">
                <Label htmlFor="isDefault" className="text-sm">
                  Set as default
                </Label>
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filePath">File Path *</Label>
              <div className="flex gap-2">
                <Input
                  id="filePath"
                  placeholder="C:\Users\...\Resume.pdf"
                  value={formData.filePath}
                  onChange={(e) =>
                    setFormData({ ...formData, filePath: e.target.value })
                  }
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the full path to your resume file on your computer
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this resume version..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="frontend, react, intern (comma separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddResume} disabled={isCreating}>
              {isCreating ? "Adding..." : "Add Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resume Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Resume
            </DialogTitle>
            <DialogDescription>Update your resume details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Resume Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-version">Version</Label>
                <Input
                  id="edit-version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-6">
                <Label htmlFor="edit-isDefault" className="text-sm">
                  Set as default
                </Label>
                <Switch
                  id="edit-isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-filePath">File Path *</Label>
              <Input
                id="edit-filePath"
                value={formData.filePath}
                onChange={(e) =>
                  setFormData({ ...formData, filePath: e.target.value })
                }
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedResume(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditResume}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedResume?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedResume(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteResume}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Resumes;
