import React, { useEffect, useState, useMemo } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate } from "zmp-ui";
import { courseService, Course } from "@/services/course";

// Provider color mapping for visual distinction
const providerColors: Record<string, { bg: string; text: string; border: string }> = {
    AWS: { bg: "from-orange-500 to-amber-500", text: "text-orange-400", border: "border-orange-500/30" },
    Azure: { bg: "from-blue-500 to-cyan-500", text: "text-blue-400", border: "border-blue-500/30" },
    GCP: { bg: "from-red-500 to-yellow-500", text: "text-red-400", border: "border-red-500/30" },
    default: { bg: "from-slate-500 to-slate-600", text: "text-slate-400", border: "border-slate-500/30" },
};

// Level badge colors
const levelColors: Record<string, string> = {
    Foundational: "bg-green-500/20 text-green-400",
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

const CoursesPage = () => {
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState(0); // 0 = All courses
    const [error, setError] = useState<string | null>(null);
    const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await courseService.getAll(1, 50); // Get all courses
            setAllCourses(response.data);
        } catch (err: any) {
            setError(err.message || "Không thể tải khoá học");
            console.error("Fetch courses error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Filter courses based on selected provider and course
    const filteredCourses = useMemo(() => {
        let filtered = allCourses;

        // Filter by provider (using providerId from course)
        if (selectedProvider > 0) {
            filtered = filtered.filter(c => c.provider.id === selectedProvider);
        }

        // Filter by specific course
        if (selectedCourse > 0) {
            filtered = filtered.filter(c => c.id === selectedCourse);
        }

        return filtered;
    }, [allCourses, selectedProvider, selectedCourse]);

    // Get course options for dropdown (filtered by provider if selected)
    const courseOptions = useMemo(() => {
        let courses = allCourses;
        if (selectedProvider > 0) {
            courses = courses.filter(c => c.provider.id === selectedProvider);
        }
        return [{ id: 0, title: "Tất cả chứng chỉ" }, ...courses];
    }, [allCourses, selectedProvider]);

    const getProviderStyle = (providerName: string) => {
        return providerColors[providerName] || providerColors.default;
    };

    const selectedProviderName = providerOptions.find(p => p.id === selectedProvider)?.name || "Tất cả";
    const selectedCourseName = selectedCourse === 0
        ? "Tất cả chứng chỉ"
        : allCourses.find(c => c.id === selectedCourse)?.title || "Tất cả chứng chỉ";

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
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
                    <Text.Title className="text-white !text-lg !font-bold">Khoá học</Text.Title>
                </div>
            </Box>

            {/* Filter Dropdowns */}
            <Box className="px-4 py-3 flex flex-col gap-3">
                {/* Provider Dropdown */}
                <div className="relative flex-1">
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
                                        setSelectedCourse(0); // Reset course filter when provider changes
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
                <div className="relative flex-1">
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
                            onClick={fetchCourses}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Icon icon="zi-note" className="text-slate-500 text-4xl" />
                        <Text className="text-slate-400 text-sm">Không có khoá học nào</Text>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredCourses.map((course) => {
                            const providerStyle = getProviderStyle(course.provider.name);
                            return (
                                <div
                                    key={course.id}
                                    className={`bg-slate-800/40 border ${providerStyle.border} rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all`}
                                    onClick={() => navigate(`/exams?courseId=${course.id}`)}
                                >
                                    <div className="flex gap-3">
                                        {/* Thumbnail or Gradient Placeholder */}
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${providerStyle.bg} flex-shrink-0 flex items-center justify-center shadow-lg`}>
                                            {course.thumbnailUrl ? (
                                                <img
                                                    src={course.thumbnailUrl}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <Icon icon="zi-video-solid" className="text-white text-2xl" />
                                            )}
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0">
                                            <Text className="text-white font-bold text-sm line-clamp-2 mb-1">
                                                {course.title}
                                            </Text>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs font-medium ${providerStyle.text}`}>
                                                    {course.provider.name}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[course.level] || "bg-slate-500/20 text-slate-400"}`}>
                                                    {course.level}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Icon icon="zi-note" className="text-slate-500 text-xs" />
                                                <Text className="text-slate-500 text-xs">
                                                    {course._count.exams} đề thi
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex items-center">
                                            <Icon icon="zi-chevron-right" className="text-slate-600" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Box>
        </Page>
    );
};

export default CoursesPage;
