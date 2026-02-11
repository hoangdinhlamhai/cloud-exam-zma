import React, { useState } from "react";
import { Page, Box, Text, Input, Button, Icon, useNavigate, useSnackbar } from "zmp-ui";
import { authService } from "@/services/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [email, setEmail] = useState("lamhai@gmail.com");
    const [password, setPassword] = useState("12345678");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            openSnackbar({
                icon: true,
                text: "Please enter email and password",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const data = await authService.login(email, password);
            // Assuming response structure: { access_token: "...", user: ... } or similar
            // If the backend returns just access_token, adapt accordingly.
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken); // Simple storage for web/mini-app
            }
            openSnackbar({
                icon: true,
                text: "Login successful!",
                type: "success",
                duration: 3000,
            });
            navigate('/home');
        } catch (error: any) {
            openSnackbar({
                icon: true,
                text: error.message || "Login failed",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <Box className="flex-1 flex flex-col justify-center px-6 relative z-10 w-full max-w-md mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-block relative mb-4">
                        <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-40"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-white font-black text-3xl">C</span>
                        </div>
                    </div>
                    <Text.Title size="xLarge" className="text-white !text-2xl !font-bold mb-2">
                        Welcome Back
                    </Text.Title>
                    <Text className="text-slate-400 text-sm">
                        Please sign in to continue learning
                    </Text>
                </div>

                {/* Login Form */}
                <Box className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl">
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <Text className="text-slate-300 font-medium text-xs ml-1">Email</Text>
                            <Input
                                placeholder="Enter your email"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <Text className="text-slate-300 font-medium text-xs">Password</Text>
                                <Text
                                    className="text-cyan-400 text-xs font-semibold cursor-pointer hover:text-cyan-300"
                                    onClick={() => console.log('Forgot password')}
                                >
                                    Forgot?
                                </Text>
                            </div>
                            <Input.Password
                                placeholder="Enter your password"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Sign In Button */}
                        <Button
                            className="!bg-gradient-to-r !from-cyan-400 !to-blue-500 !text-white !font-bold !text-base !rounded-xl !h-12 !w-full !border-0 !shadow-lg !shadow-cyan-500/20 !mt-2"
                            onClick={handleLogin}
                            loading={isLoading}
                        >
                            Sign In
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs">Or continue with</span>
                        <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-white/5 rounded-xl h-11 transition-colors">
                            <Icon icon="zi-chat" className="text-blue-500" />
                            <span className="text-white text-sm font-medium">Zalo</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-white/5 rounded-xl h-11 transition-colors">
                            <Icon icon="zi-more-grid" className="text-red-500" />
                            <span className="text-white text-sm font-medium">Google</span>
                        </button>
                    </div>
                </Box>

                {/* Footer */}
                <div className="text-center mt-8">
                    <Text className="text-slate-400 text-sm">
                        Don't have an account?{" "}
                        <span
                            className="text-cyan-400 font-bold cursor-pointer hover:text-cyan-300 transition-colors"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </span>
                    </Text>
                </div>
            </Box>
        </Page>
    );
};

export default LoginPage;
