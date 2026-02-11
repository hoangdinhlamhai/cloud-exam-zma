const API_URL = "http://localhost:3001/api";

// Helper to get token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export interface SubmitExamDto {
    examId: number;
    answers: {
        questionId: number;
        answerId: number;
    }[];
}

export interface QuestionResult {
    questionId: number;
    isCorrect: boolean;
    userAnswerId: number;
    correctAnswerId: number;
    explanation: string | null;
}

export interface ExamSubmissionResponse {
    examResultId: number;
    score: number;
    totalQuestions: number;
    correctCount: number;
    details: QuestionResult[];
}

export interface ExamResultHistory {
    id: number;
    score: number;
    correctCount: number;
    totalQuestions: number;
    completedAt: string;
    passed: boolean;
    exam: {
        id: number;
        title: string;
        course?: {
            id: number;
            title: string;
            level: string;
        };
    };
    userAnswers?: UserAnswerRecord[];
}

export interface UserAnswerRecord {
    questionId: number;
    answerId: number;
    isCorrect: boolean;
}

export interface ExamHistoryResponse {
    data: ExamResultHistory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserStats {
    totalExamsTaken: number;
    averageScore: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    passedExams: number;
    failedExams: number;
}

export const examResultService = {
    /**
     * Submit exam answers and save result
     * @param examId - Exam ID
     * @param answers - Array of { questionId, answerId }
     */
    submitExam: async (examId: number, answers: { questionId: number; answerId: number }[]): Promise<ExamSubmissionResponse> => {
        try {
            const response = await fetch(`${API_URL}/exam-results`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ examId, answers }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit exam");
            }

            return await response.json();
        } catch (error) {
            console.error("Submit exam error:", error);
            throw error;
        }
    },

    /**
     * Get exam history for current user
     */
    getHistory: async (page: number = 1, limit: number = 10): Promise<ExamHistoryResponse> => {
        try {
            const response = await fetch(`${API_URL}/exam-results/history?page=${page}&limit=${limit}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch history");
            }

            return await response.json();
        } catch (error) {
            console.error("Get history error:", error);
            throw error;
        }
    },

    /**
     * Get user statistics
     */
    getStats: async (): Promise<UserStats> => {
        try {
            const response = await fetch(`${API_URL}/exam-results/stats`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch stats");
            }

            return await response.json();
        } catch (error) {
            console.error("Get stats error:", error);
            throw error;
        }
    },

    /**
     * Get specific exam result by ID
     */
    getResultById: async (id: number): Promise<ExamResultHistory> => {
        try {
            const response = await fetch(`${API_URL}/exam-results/${id}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch result");
            }

            return await response.json();
        } catch (error) {
            console.error("Get result error:", error);
            throw error;
        }
    },
};
