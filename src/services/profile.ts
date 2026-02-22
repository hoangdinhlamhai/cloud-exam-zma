const API_URL = "http://localhost:3001/api";

const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export interface UserProfile {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt: string;
}

export interface UserStats {
    totalExamsTaken: number;
    averageScore: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    passedExams: number;
    failedExams: number;
    totalNotes: number;
}

export interface UpdateProfileData {
    fullName?: string;
    avatarUrl?: string;
    currentPassword?: string;
    newPassword?: string;
}

export const profileService = {
    /**
     * Get current user profile
     * GET /api/profile
     */
    getProfile: async (): Promise<UserProfile> => {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch profile");
            }

            return await response.json();
        } catch (error) {
            console.error("Get profile error:", error);
            throw error;
        }
    },

    /**
     * Get user statistics
     * GET /api/exam-results/stats
     */
    getStats: async (): Promise<UserStats> => {
        try {
            const response = await fetch(`${API_URL}/exam-results/stats`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch stats");
            }

            return await response.json();
        } catch (error) {
            console.error("Get stats error:", error);
            throw error;
        }
    },

    /**
     * Update user profile (fullName, password, etc.)
     * PATCH /api/profile
     */
    updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update profile");
            }

            return await response.json();
        } catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    },

    /**
     * Upload avatar image
     * POST /api/profile/avatar (multipart/form-data)
     */
    uploadAvatar: async (file: File): Promise<UserProfile> => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/profile/avatar`, {
                method: "POST",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    // Don't set Content-Type — browser adds boundary for multipart
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to upload avatar");
            }

            return await response.json();
        } catch (error) {
            console.error("Upload avatar error:", error);
            throw error;
        }
    },

    /**
     * Delete avatar image
     * DELETE /api/profile/avatar
     */
    deleteAvatar: async (): Promise<UserProfile> => {
        try {
            const response = await fetch(`${API_URL}/profile/avatar`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to delete avatar");
            }

            return await response.json();
        } catch (error) {
            console.error("Delete avatar error:", error);
            throw error;
        }
    },
};
