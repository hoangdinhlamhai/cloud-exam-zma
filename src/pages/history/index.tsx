import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate } from "zmp-ui";
import { examResultService, ExamResultHistory, UserStats } from "@/services/examResult";

// Level colors for badges
const levelColors: Record<string, string> = {
    Foundational: "bg-green-500/20 text-green-400",
    Associate: "bg-blue-500/20 text-blue-400",
    Professional: "bg-purple-500/20 text-purple-400",
    Specialty: "bg-pink-500/20 text-pink-400",
};

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<ExamResultHistory[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [historyData, statsData] = await Promise.all([
                examResultService.getHistory(1, 20),
                examResultService.getStats(),
            ]);
            setHistory(historyData.data);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || "Không thể tải lịch sử");
            console.error("Fetch history error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <Box className="sticky top-0 z-50 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <Icon icon="zi-arrow-left" className="text-white" />
                    </div>
                    <Text.Title className="text-white !text-lg !font-bold">Lịch sử luyện tập</Text.Title>
                </div>
            </Box>

            {/* Content */}
            <Box className="flex-1 px-4 py-4 overflow-y-auto pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Spinner visible />
                        <Text className="text-slate-400 text-sm">Đang tải...</Text>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Icon icon="zi-warning" className="text-red-400 text-4xl" />
                        <Text className="text-red-400 text-sm">{error}</Text>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        {stats && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                            <Icon icon="zi-note" className="text-white text-sm" />
                                        </div>
                                        <Text className="text-slate-400 text-xs">Số bài đã thi</Text>
                                    </div>
                                    <Text className="text-white text-2xl font-bold">{stats.totalExamsTaken}</Text>
                                </div>

                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                            <Icon icon="zi-star-solid" className="text-white text-sm" />
                                        </div>
                                        <Text className="text-slate-400 text-xs">Điểm trung bình</Text>
                                    </div>
                                    <Text className={`text-2xl font-bold ${stats.averageScore >= 70 ? "text-green-400" : "text-red-400"}`}>
                                        {stats.averageScore}%
                                    </Text>
                                </div>

                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                            <Icon icon="zi-check-circle-solid" className="text-white text-sm" />
                                        </div>
                                        <Text className="text-slate-400 text-xs">Đậu</Text>
                                    </div>
                                    <Text className="text-green-400 text-2xl font-bold">{stats.passedExams}</Text>
                                </div>

                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
                                            <Icon icon="zi-close-circle-solid" className="text-white text-sm" />
                                        </div>
                                        <Text className="text-slate-400 text-xs">Rớt</Text>
                                    </div>
                                    <Text className="text-red-400 text-2xl font-bold">{stats.failedExams}</Text>
                                </div>
                            </div>
                        )}

                        {/* History List */}
                        <div>
                            <Text.Title className="text-white !text-base !font-bold mb-3">Lịch sử thi gần đây</Text.Title>
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Icon icon="zi-clock-2-solid" className="text-slate-500 text-4xl" />
                                    <Text className="text-slate-400 text-sm">Chưa có lịch sử thi nào</Text>
                                    <button
                                        onClick={() => navigate("/courses")}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-medium"
                                    >
                                        Bắt đầu luyện tập
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((result) => (
                                        <div
                                            key={result.id}
                                            className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
                                            onClick={() => navigate(`/history/detail?id=${result.id}&examId=${result.exam.id}`)}
                                        >
                                            <div className="flex gap-3">
                                                {/* Score Circle */}
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${result.passed ? "bg-green-500/20" : "bg-red-500/20"}`}>
                                                    <Text className={`text-xl font-bold ${result.passed ? "text-green-400" : "text-red-400"}`}>
                                                        {result.score}%
                                                    </Text>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <Text className="text-white font-bold text-sm line-clamp-1 mb-1">
                                                        {result.exam.title}
                                                    </Text>
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[result.exam.course?.level || ""] || "bg-slate-500/20 text-slate-400"}`}>
                                                            {result.exam.course?.level || "N/A"}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                                            {result.passed ? "Đậu" : "Rớt"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-slate-500 text-xs">
                                                        <span>{result.correctCount}/{result.totalQuestions} câu đúng</span>
                                                        <span>{formatDate(result.completedAt)}</span>
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="flex items-center">
                                                    <Icon icon="zi-chevron-right" className="text-slate-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Box>
        </Page>
    );
};

export default HistoryPage;
