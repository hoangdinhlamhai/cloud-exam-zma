import React from "react";
import { Page, Box, Text, Icon, useNavigate } from "zmp-ui";

// Menu Data
const menuItems = [
    {
        key: "courses",
        icon: "zi-video-solid",
        label: "Khoá học",
        desc: "Luyện tập không giới hạn",
        color: "from-blue-400 to-indigo-500",
        shadow: "shadow-blue-500/20",
        route: "/courses",
    },
    {
        key: "exams",
        icon: "zi-note",
        label: "Đề thi",
        desc: "Luyện thi thử",
        color: "from-cyan-400 to-teal-500",
        shadow: "shadow-cyan-500/20",
        route: "/exams",
    },
    {
        key: "history",
        icon: "zi-clock-2-solid",
        label: "Lịch sử",
        desc: "Kết quả luyện tập",
        color: "from-purple-400 to-pink-500",
        shadow: "shadow-purple-500/20",
        route: "/history",
    },
    {
        key: "notes",
        icon: "zi-memory",
        label: "Ghi chú",
        desc: "Sổ tay kiến thức",
        color: "from-emerald-400 to-green-500",
        shadow: "shadow-emerald-500/20",
        route: "/notes",
    },
] as const;

// Fake User Data
const user = {
    name: "Minh Nguyen",
    level: "Pro Member",
    avatar: "M",
};

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-40 -left-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Section */}
            <Box className="sticky top-0 z-50 px-4 py-2 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20">
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center p-0.5">
                            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{user.avatar}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Text className="text-slate-400 text-xs font-medium">Welcome back,</Text>
                        <Text.Title className="text-white !text-base !font-bold">{user.name}</Text.Title>
                    </div>
                </div>
                <div
                    className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors relative"
                    onClick={() => console.log("Open Notifications")}
                >
                    <Icon icon="zi-notif-ring" className="text-cyan-400" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-slate-900"></div>
                </div>
            </Box>

            {/* Main Content */}
            <Box className="flex-1 px-4 py-6 overflow-y-auto pb-20">

                {/* Quick Stats or Promo Banner */}
                <Box className="mb-8 relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <Text className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wider">Daily Challenge</Text>
                    <Text.Title className="text-white !text-xl !font-bold mb-2">AWS Solutions Architect</Text.Title>
                    <Text className="text-white/90 text-sm mb-4 max-w-[80%]">10 new questions added today. Keep your streak alive!</Text>
                    <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                        Practice Now
                    </button>
                </Box>

                {/* Menu Grid */}
                <Text.Title className="text-white !text-lg !font-bold mb-4 px-2">Explore</Text.Title>
                <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item, idx) => (
                        <div
                            key={idx}
                            className={"bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-3 group active:scale-95 transition-all duration-200 cursor-pointer"}
                            onClick={() => navigate(item.route)}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} ${item.shadow} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon icon={item.icon} className="text-white text-xl" />
                            </div>
                            <div>
                                <Text className="text-white font-bold text-base">{item.label}</Text>
                                <Text className="text-slate-400 text-xs">{item.desc}</Text>
                            </div>

                        </div>
                    ))}
                </div>
            </Box>
        </Page>
    );
};

export default HomePage;
