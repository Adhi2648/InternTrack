import { useAuth } from "@/components/auth/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ApplicationDto = {
  _id?: string;
  id?: string; // legacy frontend id
  companyName: string;
  role: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  dateApplied: string;
  nextStep?: string;
};

const API_BASE = "http://localhost:4001/api";

export function useApplications() {
  const { authFetch, isAuthenticated, token, username } = useAuth();
  const queryClient = useQueryClient();

  const fetcher = async () => {
    if (!isAuthenticated) {
      console.log("useApplications: not authenticated, returning empty list");
      return [];
    }
    try {
      console.log(
        "Fetching applications with token:",
        token?.slice(0, 20) + "..."
      );
      const res = await authFetch(`${API_BASE}/applications`);
      console.log("Applications response:", res.status, res.statusText);
      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Failed to fetch applications:",
          res.status,
          res.statusText,
          text
        );
        throw new Error(
          `Failed to fetch applications: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      console.log("Applications data:", data);
      // map _id to id for compatibility
      return data.map((a: any) => ({ ...a, id: a._id }));
    } catch (err) {
      console.error("Error fetching applications:", err);
      throw err;
    }
  };

  const query = useQuery({
    queryKey: ["applications", username],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 2,
    enabled: isAuthenticated,
    retry: 1,
  });

  const create = useMutation({
    mutationFn: async (payload: ApplicationDto) => {
      const res = await authFetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create application");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["applications", username] }),
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ApplicationDto>;
    }) => {
      const res = await authFetch(`${API_BASE}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update application");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["applications", username] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`${API_BASE}/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204)
        throw new Error("Failed to delete application");
      return true;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["applications", username] }),
  });

  return {
    ...query,
    create,
    update,
    remove,
  };
}

export default useApplications;
