import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate } from "zmp-ui";
import { useSearchParams } from "zmp-ui";
import { examService, Exam } from "@/services/exam";
import { courseService, Course } from "@/services/course";

// Level colors for badges
const levelColors: Record<string, string> = {
    Foundational: "bg-green-500/20 text-green-400",
    Associate: "bg-blue-500/20 text-blue-400",
    Professional: "bg-purple-500/20 text-purple-400",
    Specialty: "bg-pink-500/20 text-pink-400",
};

const ExamsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");

    const [exams, setExams] = useState<Exam[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExams = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (courseId) {
                const courseData = await courseService.getById(parseInt(courseId));
                setCourse(courseData);
                const examsData = await examService.getByCourse(parseInt(courseId));
                setExams(examsData);
            } else {
                const response = await examService.getAll(1, 20);
                setExams(response.data);
            }
        } catch (err: any) {
            setError(err.message || "Không thể tải đề thi");
            console.error("Fetch exams error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, [courseId]);

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <Box className="sticky top-0 z-50 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <Icon icon="zi-arrow-left" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text.Title className="text-white !text-lg !font-bold truncate">
                            {course ? course.title : "Đề thi"}
                        </Text.Title>
                        {course && (
                            <Text className={`text-xs ${levelColors[course.level] || "text-slate-400"}`}>
                                {course.level} • {course.provider.name}
                            </Text>
                        )}
                    </div>
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
                            onClick={fetchExams}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Icon icon="zi-note" className="text-slate-500 text-4xl" />
                        <Text className="text-slate-400 text-sm">Không có đề thi nào</Text>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
                                onClick={() => navigate(`/exam?id=${exam.id}`)}
                            >
                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                        <Icon icon="zi-note" className="text-white text-2xl" />
                                    </div>

                                    {/* Exam Info */}
                                    <div className="flex-1 min-w-0">
                                        <Text className="text-white font-bold text-sm line-clamp-2 mb-1">
                                            {exam.title}
                                        </Text>
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[exam.course.level] || "bg-slate-500/20 text-slate-400"}`}>
                                                {exam.course.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Icon icon="zi-clock-1" className="text-xs" />
                                                <span>{exam.durationMinutes} phút</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icon icon="zi-list-1" className="text-xs" />
                                                <span>{exam._count.questions} câu</span>
                                            </div>
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
            </Box>
        </Page>
    );
};

export default ExamsPage;
