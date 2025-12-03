import {
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Internship, useInternships } from "../hooks/useInternships";

export default function Internships() {
  const { data: internships, isLoading, error } = useInternships();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getDaysAgo = (dateString: string) => {
    try {
      const posted = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - posted.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    } catch {
      return "";
    }
  };

  // Filter internships - only show United States
  const filteredInternships = internships?.filter((internship) => {
    const isUSA = internship.country === "United States";

    const matchesSearch =
      searchQuery === "" ||
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.organization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchQuery.toLowerCase());

    return isUSA && matchesSearch;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Internships</h1>
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">
                Error Loading Internships
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to fetch internships"}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🎯 Internships
          </h1>
          <p className="text-muted-foreground">
            Fresh internship opportunities updated daily • Click any card for
            details
          </p>
        </div>

        {/* Pro Tips Card */}
        <Card className="mb-6 border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  💡 Pro Tips for Students
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>
                    • Look for{" "}
                    <Badge className="text-[10px] py-0 px-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      Easy Apply
                    </Badge>{" "}
                    badges for quick applications
                  </li>
                  <li>
                    •{" "}
                    <Badge variant="outline" className="text-[10px] py-0 px-1">
                      Remote
                    </Badge>{" "}
                    positions offer flexibility
                  </li>
                  <li>
                    • Apply early! Positions are posted within the last 7 days
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {!isLoading && filteredInternships && (
          <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">
                  {filteredInternships.length}
                </strong>{" "}
                opportunities in the United States
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              Loading internships...
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a moment
            </p>
          </div>
        ) : filteredInternships && filteredInternships.length > 0 ? (
          /* Internship Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInternships.map((internship) => (
              <Card
                key={internship.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedInternship(internship)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {internship.organization_logo ? (
                      <img
                        src={internship.organization_logo}
                        alt={internship.organization}
                        className="h-12 w-12 rounded-lg object-cover flex-shrink-0 bg-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                        {internship.title}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium">
                        {internship.organization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{internship.location}</span>
                    {internship.remote && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Remote
                      </Badge>
                    )}
                  </div>

                  {/* Industry */}
                  {internship.linkedin_org_industry && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {internship.linkedin_org_industry}
                      </span>
                    </div>
                  )}

                  {/* Posted Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{getDaysAgo(internship.date_posted)}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge variant="secondary" className="text-xs">
                      {internship.source}
                    </Badge>
                    {internship.directapply && (
                      <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50">
                        Easy Apply
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No internships found</CardTitle>
              <CardDescription>
                Try adjusting your search to find more opportunities.
              </CardDescription>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Internship Detail Modal */}
        <Dialog
          open={!!selectedInternship}
          onOpenChange={() => setSelectedInternship(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh]">
            {selectedInternship && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    {selectedInternship.organization_logo ? (
                      <img
                        src={selectedInternship.organization_logo}
                        alt={selectedInternship.organization}
                        className="h-16 w-16 rounded-lg object-cover bg-muted"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <DialogTitle className="text-xl">
                        {selectedInternship.title}
                      </DialogTitle>
                      <DialogDescription className="text-base font-medium mt-1">
                        {selectedInternship.organization}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 py-4">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedInternship.location}</span>
                      </div>
                      {selectedInternship.linkedin_org_industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {selectedInternship.linkedin_org_industry}
                          </span>
                        </div>
                      )}
                      {selectedInternship.linkedin_org_employees && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {selectedInternship.linkedin_org_employees.toLocaleString()}{" "}
                            employees
                          </span>
                        </div>
                      )}
                      {selectedInternship.linkedin_org_headquarters && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>
                            HQ: {selectedInternship.linkedin_org_headquarters}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Posted:</span>{" "}
                        <span className="font-medium">
                          {formatDate(selectedInternship.date_posted)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expires:</span>{" "}
                        <span className="font-medium">
                          {formatDate(selectedInternship.date_validthrough)}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {selectedInternship.remote && (
                        <Badge variant="outline">🏠 Remote</Badge>
                      )}
                      {selectedInternship.directapply && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50">
                          ⚡ Easy Apply
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {selectedInternship.source}
                      </Badge>
                      {selectedInternship.seniority && (
                        <Badge variant="outline">
                          {selectedInternship.seniority}
                        </Badge>
                      )}
                    </div>

                    {/* Company Slogan */}
                    {selectedInternship.linkedin_org_slogan && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm italic">
                          "{selectedInternship.linkedin_org_slogan}"
                        </p>
                      </div>
                    )}

                    {/* Company Description */}
                    {selectedInternship.linkedin_org_description && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          About {selectedInternship.organization}
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
                          {selectedInternship.linkedin_org_description}
                        </p>
                      </div>
                    )}

                    {/* Specialties */}
                    {selectedInternship.linkedin_org_specialties &&
                      selectedInternship.linkedin_org_specialties.length > 0 &&
                      selectedInternship.linkedin_org_specialties[0] !== "" && (
                        <div>
                          <h4 className="font-semibold mb-2">
                            Company Specialties
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedInternship.linkedin_org_specialties.map(
                              (specialty, idx) =>
                                specialty && (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {specialty}
                                  </Badge>
                                )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </ScrollArea>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <a
                    href={
                      selectedInternship.external_apply_url ||
                      selectedInternship.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </a>
                  {selectedInternship.organization_url && (
                    <a
                      href={selectedInternship.organization_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="lg">
                        <Building2 className="h-4 w-4 mr-2" />
                        Company
                      </Button>
                    </a>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
