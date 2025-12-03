import { useQuery } from "@tanstack/react-query";

export interface Internship {
  id: string;
  title: string;
  organization: string;
  organization_url?: string;
  organization_logo?: string;
  location: string;
  country: string;
  city?: string;
  salary_raw?: any;
  employment_type: string[];
  url: string;
  date_posted: string;
  date_validthrough: string;
  remote: boolean;
  seniority?: string;
  directapply: boolean;
  external_apply_url?: string;
  linkedin_org_industry?: string;
  linkedin_org_size?: string;
  linkedin_org_slogan?: string;
  linkedin_org_description?: string;
  linkedin_org_specialties?: string[];
  linkedin_org_employees?: number;
  linkedin_org_headquarters?: string;
  source: string;
}

// Transform raw API data to Internship format
const transformInternshipData = (rawData: any): Internship => {
  // Extract location info
  const locations = rawData.locations_derived || [];
  const location = locations[0] || "Location not specified";
  const countries = rawData.countries_derived || [];
  const country = countries[0] || "Unknown";
  const cities = rawData.cities_derived || [];
  const city = cities[0] || undefined;

  return {
    id: rawData.id,
    title: rawData.title,
    organization: rawData.organization,
    organization_url: rawData.organization_url,
    organization_logo: rawData.organization_logo,
    location,
    country,
    city,
    salary_raw: rawData.salary_raw,
    employment_type: rawData.employment_type || ["INTERN"],
    url: rawData.url,
    date_posted: rawData.date_posted,
    date_validthrough: rawData.date_validthrough,
    remote: rawData.remote_derived || false,
    seniority: rawData.seniority,
    directapply: rawData.directapply || false,
    external_apply_url: rawData.external_apply_url,
    linkedin_org_industry: rawData.linkedin_org_industry,
    linkedin_org_size: rawData.linkedin_org_size,
    linkedin_org_slogan: rawData.linkedin_org_slogan,
    linkedin_org_description: rawData.linkedin_org_description,
    linkedin_org_specialties: rawData.linkedin_org_specialties,
    linkedin_org_employees: rawData.linkedin_org_employees,
    linkedin_org_headquarters: rawData.linkedin_org_headquarters,
    source: rawData.source || "linkedin",
  };
};

export const useInternships = () => {
  return useQuery({
    queryKey: ["internships"],
    queryFn: async () => {
      const apiKey = "747e9d9b33msh402b80ae75c8515p1ed9aejsn7e6c1cc2284b";

      const response = await fetch(
        "https://internships-api.p.rapidapi.com/active-jb-7d?limit=500",
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "internships-api.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform all internships
      const internships: Internship[] = data.map((job: any) =>
        transformInternshipData(job)
      );

      return internships;
    },
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
};
