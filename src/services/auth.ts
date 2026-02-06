const API_URL = "http://localhost:3000/api";

// Helper to safely parse JSON response
const parseResponse = async (response: Response) => {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        console.error("Response is not JSON:", text);
        return { message: text || "Server error" };
    }
};

export const authService = {
    login: async (email: string, password: string) => {
        try {
            console.log("Calling login API...", { email });
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("Login response status:", response.status);

            const data = await parseResponse(response);

            if (!response.ok) {
                console.error("Login API error:", data);
                // Handle nested message (NestJS validation errors)
                const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
                throw new Error(errorMsg || "Login failed");
            }

            console.log("Login success:", data);
            return data;
        } catch (error: any) {
            console.error("Login error:", error);
            // Re-throw with clearer message if it's a network error
            if (error.name === "TypeError" && error.message === "Failed to fetch") {
                throw new Error("Network error. Please check your connection.");
            }
            throw error;
        }
    },

    register: async (fullName: string, email: string, password: string) => {
        try {
            console.log("Calling register API...", { fullName, email });
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            console.log("Register response status:", response.status);

            const data = await parseResponse(response);

            if (!response.ok) {
                console.error("Register API error:", data);
                const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
                throw new Error(errorMsg || "Registration failed");
            }

            console.log("Register success:", data);
            return data;
        } catch (error: any) {
            console.error("Register error:", error);
            if (error.name === "TypeError" && error.message === "Failed to fetch") {
                throw new Error("Network error. Please check your connection.");
            }
            throw error;
        }
    },

    getProfile: async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await parseResponse(response);

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch profile");
            }

            return data;
        } catch (error: any) {
            console.error("GetProfile error:", error);
            throw error;
        }
    },
};
