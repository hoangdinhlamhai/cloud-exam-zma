import React, { useState } from "react";
import { Page, Box, Text, Input, Button, Icon, useNavigate, useSnackbar } from "zmp-ui";
import { authService } from "@/services/auth";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            openSnackbar({
                icon: true,
                text: "Please fill in all fields",
                type: "warning",
                duration: 3000,
            });
            return;
        }

        if (password !== confirmPassword) {
            openSnackbar({
                icon: true,
                text: "Passwords do not match",
                type: "error",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            await authService.register(fullName, email, password);
            openSnackbar({
                icon: true,
                text: "Registration successful! Please login.",
                type: "success",
                duration: 3000,
            });
            navigate('/login');
        } catch (error: any) {
            openSnackbar({
                icon: true,
                text: error.message || "Registration failed",
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
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <Box className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10 w-full max-w-md mx-auto">
                {/* Back Button */}
                <div
                    className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <Icon icon="zi-arrow-left" className="text-white" />
                </div>

                {/* Header Section */}
                <div className="text-center mb-6 mt-8">
                    <Text.Title size="xLarge" className="text-white !text-2xl !font-bold mb-2">
                        Create Account
                    </Text.Title>
                    <Text className="text-slate-400 text-sm">
                        Join thousands of cloud professionals
                    </Text>
                </div>

                {/* Register Form */}
                <Box className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl">
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Text className="text-slate-300 font-medium text-xs ml-1">Full Name</Text>
                            <Input
                                placeholder="Ex: Nguyen Van A"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Text className="text-slate-300 font-medium text-xs ml-1">Email Address</Text>
                            <Input
                                placeholder="name@example.com"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Text className="text-slate-300 font-medium text-xs ml-1">Password</Text>
                            <Input.Password
                                placeholder="Min 8 characters"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <Text className="text-slate-300 font-medium text-xs ml-1">Confirm Password</Text>
                            <Input.Password
                                placeholder="Re-enter password"
                                className="!bg-slate-900/50 !border-white/10 !text-white !rounded-xl !h-12 focus:!border-cyan-500 placeholder:text-slate-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Terms Checkbox Placeholder (Visual only) */}
                        <div className="flex items-start gap-3 py-1">
                            <div className="w-5 h-5 rounded border border-slate-600 bg-slate-900/50 flex items-center justify-center mt-0.5">
                                {/* <Icon icon="zi-check" className="text-cyan-400 text-xs" /> */}
                            </div>
                            <Text className="text-slate-400 text-xs leading-tight">
                                By signing up, you agree to our <span className="text-cyan-400 cursor-pointer">Terms</span> and <span className="text-cyan-400 cursor-pointer">Privacy Policy</span>.
                            </Text>
                        </div>

                        {/* Sign Up Button */}
                        <Button
                            className="!bg-gradient-to-r !from-cyan-400 !to-blue-500 !text-white !font-bold !text-base !rounded-xl !h-12 !w-full !border-0 !shadow-lg !shadow-cyan-500/20"
                            onClick={handleRegister}
                            loading={isLoading}
                        >
                            Create Account
                        </Button>
                    </div>
                </Box>

                {/* Footer */}
                <div className="text-center mt-6">
                    <Text className="text-slate-400 text-sm">
                        Already have an account?{" "}
                        <span
                            className="text-cyan-400 font-bold cursor-pointer hover:text-cyan-300 transition-colors"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </span>
                    </Text>
                </div>
            </Box>
        </Page>
    );
};

export default RegisterPage;
