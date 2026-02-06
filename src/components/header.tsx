import React from "react";
import { Box, Button, Text, useNavigate } from "zmp-ui";

const Header = () => {
    const navigate = useNavigate();
    return (
        <Box className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 sticky top-0 z-50 px-4 py-3 flex justify-between items-center border-b border-white/10">
            <Button
                size="small"
                className="!bg-gradient-to-r !from-cyan-400 !to-blue-500 !text-white !rounded-full !px-5 !font-semibold !border-0 !shadow-lg !shadow-cyan-500/25"
                onClick={() => navigate('/login')}
            >
                Sign In
            </Button>
            <div className="flex items-center gap-3 flex-row-reverse text-right">
                {/* Logo with glow effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-50"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xl">C</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <Text className="text-white font-bold text-lg leading-tight">
                        CloudExam
                    </Text>
                    <Text className="text-cyan-300 text-xs font-medium">
                        Master the Cloud
                    </Text>
                </div>
            </div>
        </Box>
    );
};

export default Header;
