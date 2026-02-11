import React, { useEffect, useState, useMemo } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate } from "zmp-ui";
import { examService, Exam } from "@/services/exam";
import { courseService, Course } from "@/services/course";

// Level colors for badges
const levelColors: Record<string, string> = {
    Foundational: "bg-green-500/20 text-green-400",
    Practitioner: "bg-green-500/20 text-green-400",
    Associate: "bg-blue-500/20 text-blue-400",
    Professional: "bg-purple-500/20 text-purple-400",
    Specialty: "bg-pink-500/20 text-pink-400",
};

// Provider options
const providerOptions = [
    { id: 0, name: "Tất cả" },
    { id: 1, name: "AWS" },
    { id: 2, name: "Azure" },
    { id: 3, name: "GCP" },
];

const ExamsPage = () => {
    const navigate = useNavigate();
    const [allExams, setAllExams] = useState<Exam[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProvider, setSelectedProvider] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState(0);
    const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [examsResponse, coursesResponse] = await Promise.all([
                examService.getAll(1, 100), // Get all exams
                courseService.getAll(1, 100), // Get all courses for filter
            ]);
            setAllExams(examsResponse.data);
            setAllCourses(coursesResponse.data);
        } catch (err: any) {
            setError(err.message || "Không thể tải đề thi");
            console.error("Fetch data error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter exams based on selected provider and course
    const filteredExams = useMemo(() => {
        let filtered = allExams;

        // Filter by provider
        if (selectedProvider > 0) {
            // Get courseIds that belong to the selected provider
            const providerCourseIds = allCourses
                .filter(c => c.provider.id === selectedProvider)
                .map(c => c.id);
            filtered = filtered.filter(e => providerCourseIds.includes(e.course.id));
        }

        // Filter by specific course
        if (selectedCourse > 0) {
            filtered = filtered.filter(e => e.course.id === selectedCourse);
        }

        return filtered;
    }, [allExams, allCourses, selectedProvider, selectedCourse]);

    // Get course options for dropdown (filtered by provider if selected)
    const courseOptions = useMemo(() => {
        let courses = allCourses;
        if (selectedProvider > 0) {
            courses = courses.filter(c => c.provider.id === selectedProvider);
        }
        return [{ id: 0, title: "Tất cả chứng chỉ" }, ...courses];
    }, [allCourses, selectedProvider]);

    const selectedProviderName = providerOptions.find(p => p.id === selectedProvider)?.name || "Tất cả";
    const selectedCourseName = selectedCourse === 0
        ? "Tất cả chứng chỉ"
        : allCourses.find(c => c.id === selectedCourse)?.title || "Tất cả chứng chỉ";

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
                    <Text.Title className="text-white !text-lg !font-bold">Đề thi</Text.Title>
                </div>
            </Box>

            {/* Filter Dropdowns */}
            <Box className="px-4 py-3 flex flex-col gap-3">
                {/* Provider Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsProviderDropdownOpen(!isProviderDropdownOpen);
                            setIsCourseDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-between text-left"
                    >
                        <div>
                            <Text className="text-slate-500 text-xs">Nhà cung cấp</Text>
                            <Text className="text-white text-sm font-medium">{selectedProviderName}</Text>
                        </div>
                        <Icon
                            icon={isProviderDropdownOpen ? "zi-chevron-up" : "zi-chevron-down"}
                            className="text-slate-400"
                        />
                    </button>

                    {/* Provider Dropdown Menu */}
                    {isProviderDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
                            {providerOptions.map((provider) => (
                                <button
                                    key={provider.id}
                                    onClick={() => {
                                        setSelectedProvider(provider.id);
                                        setSelectedCourse(0);
                                        setIsProviderDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${selectedProvider === provider.id
                                            ? "bg-cyan-500/20 text-cyan-400"
                                            : "text-white hover:bg-slate-700"
                                        }`}
                                >
                                    {provider.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Course (Certificate) Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsCourseDropdownOpen(!isCourseDropdownOpen);
                            setIsProviderDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-between text-left"
                    >
                        <div className="flex-1 min-w-0">
                            <Text className="text-slate-500 text-xs">Chứng chỉ</Text>
                            <Text className="text-white text-sm font-medium truncate">{selectedCourseName}</Text>
                        </div>
                        <Icon
                            icon={isCourseDropdownOpen ? "zi-chevron-up" : "zi-chevron-down"}
                            className="text-slate-400 flex-shrink-0"
                        />
                    </button>

                    {/* Course Dropdown Menu */}
                    {isCourseDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-64 overflow-y-auto">
                            {courseOptions.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => {
                                        setSelectedCourse(course.id);
                                        setIsCourseDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${selectedCourse === course.id
                                            ? "bg-cyan-500/20 text-cyan-400"
                                            : "text-white hover:bg-slate-700"
                                        }`}
                                >
                                    <span className="line-clamp-1">{course.title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Box>

            {/* Click overlay to close dropdowns */}
            {(isProviderDropdownOpen || isCourseDropdownOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsProviderDropdownOpen(false);
                        setIsCourseDropdownOpen(false);
                    }}
                />
            )}

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
                ) : filteredExams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Icon icon="zi-note" className="text-slate-500 text-4xl" />
                        <Text className="text-slate-400 text-sm">Không có đề thi nào</Text>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Results Count */}
                        <Text className="text-slate-400 text-sm">
                            {filteredExams.length} đề thi
                        </Text>

                        {filteredExams.map((exam) => (
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
                                            <span className="text-xs text-cyan-400">
                                                {exam.course.title}
                                            </span>
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
