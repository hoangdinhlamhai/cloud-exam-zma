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

export interface Note {
    id: number;
    content: string;
    questionId: number | null;
    courseId: number | null;
    createdAt: string;
    updatedAt: string;
    question?: {
        id: number;
        content: string;
        exam?: {
            id: number;
            title: string;
            course?: {
                id: number;
                title: string;
            };
        };
    };
    course?: {
        id: number;
        title: string;
    };
}

const getAllNotes = async (): Promise<Note[]> => {
    try {
        const response = await fetch(`${API_URL}/notes`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get notes");
        }

        return await response.json();
    } catch (error) {
        console.error("Get notes error:", error);
        throw error;
    }
};

const saveNote = async (data: { courseId?: number; questionId: number; content: string }) => {
    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save note");
        }

        return await response.json();
    } catch (error) {
        console.error("Save note error:", error);
        throw error;
    }
};

const getNoteByQuestion = async (questionId: number) => {
    try {
        const response = await fetch(`${API_URL}/notes/question/${questionId}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get note");
        }

        return await response.json();
    } catch (error) {
        console.error("Get note error:", error);
        throw error;
    }
};

const deleteNote = async (noteId: number) => {
    try {
        const response = await fetch(`${API_URL}/notes/${noteId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete note");
        }

        return await response.json();
    } catch (error) {
        console.error("Delete note error:", error);
        throw error;
    }
};

export const noteService = {
    getAllNotes,
    saveNote,
    getNoteByQuestion,
    deleteNote,
};