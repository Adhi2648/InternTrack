import { useAuth } from "@/components/auth/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:4001/api/resumes";

export interface Resume {
  _id: string;
  userId: string;
  name: string;
  version: string;
  filePath: string;
  description: string;
  tags: string[];
  usedBy: {
    applicationId?: string;
    company: string;
    role: string;
    appliedAt: string;
  }[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeData {
  name: string;
  version?: string;
  filePath: string;
  description?: string;
  tags?: string[];
  isDefault?: boolean;
}

export interface UpdateResumeData extends Partial<CreateResumeData> {
  _id: string;
}

export default function useResumes() {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await authFetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch resumes");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateResumeData) => {
      const res = await authFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ _id, ...data }: UpdateResumeData) => {
      const res = await authFetch(`${API_URL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  return {
    ...query,
    resumes: query.data ?? [],
    createResume: createMutation.mutateAsync,
    updateResume: updateMutation.mutateAsync,
    deleteResume: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
