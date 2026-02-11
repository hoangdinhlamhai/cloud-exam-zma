import React, { useEffect, useState, useCallback } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate, useSearchParams } from "zmp-ui";
import { examResultService, ExamResultHistory } from "@/services/examResult";
import { questionService, Question } from "@/services/question";

// Level colors for badges
const levelColors: Record<string, string> = {
    Foundational: "bg-green-500/20 text-green-400",
    Practitioner: "bg-green-500/20 text-green-400",
    Associate: "bg-blue-500/20 text-blue-400",
    Professional: "bg-purple-500/20 text-purple-400",
    Specialty: "bg-pink-500/20 text-pink-400",
};

const HistoryDetailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resultId = searchParams.get("id");
    const examId = searchParams.get("examId");

    const [result, setResult] = useState<ExamResultHistory | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchData = useCallback(async () => {
        if (!resultId || !examId) return;
        setIsLoading(true);
        setError(null);
        try {
            // Fetch result details and questions with correct answers
            const [resultData, questionsData] = await Promise.all([
                examResultService.getResultById(parseInt(resultId)),
                questionService.getByExam(parseInt(examId), true), // showAnswers = true to get correct answers
            ]);
            setResult(resultData);
            setQuestions(questionsData);
        } catch (err: any) {
            setError(err.message || "Không thể tải chi tiết");
            console.error("Fetch history detail error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [resultId, examId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const currentQuestion = questions[currentIndex];

    if (isLoading) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center">
                <Spinner visible />
                <Text className="text-slate-400 text-sm mt-3">Đang tải...</Text>
            </Page>
        );
    }

    if (error || !result) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center px-6">
                <Icon icon="zi-warning" className="text-red-400 text-4xl mb-3" />
                <Text className="text-red-400 text-sm mb-4">{error || "Không tìm thấy kết quả"}</Text>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    Quay lại
                </button>
            </Page>
        );
    }

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
                        <Text.Title className="text-white !text-base !font-bold truncate">
                            {result.exam.title}
                        </Text.Title>
                        <Text className="text-slate-400 text-xs">
                            {formatDate(result.completedAt)}
                        </Text>
                    </div>
                </div>
            </Box>

            {/* Result Summary */}
            <Box className="px-4 py-4">
                <div className={`rounded-2xl p-4 ${result.passed ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <Text className="text-slate-400 text-xs mb-1">Kết quả</Text>
                            <div className="flex items-center gap-2">
                                <Text className={`text-3xl font-bold ${result.passed ? "text-green-400" : "text-red-400"}`}>
                                    {result.score}%
                                </Text>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {result.passed ? "ĐẬU" : "RỚT"}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <Text className="text-slate-400 text-xs mb-1">Số câu đúng</Text>
                            <Text className="text-white text-xl font-bold">
                                {result.correctCount}/{result.totalQuestions}
                            </Text>
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[result.exam.course?.level || ""] || "bg-slate-500/20 text-slate-400"}`}>
                            {result.exam.course?.level || "N/A"}
                        </span>
                        <Text className="text-slate-400 text-xs">
                            {result.exam.course?.title || "N/A"}
                        </Text>
                    </div>
                </div>
            </Box>

            {/* Questions Review */}
            {questions.length > 0 && (
                <>
                    {/* Progress Bar */}
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                            <Text className="text-slate-400 text-xs">Xem lại câu hỏi</Text>
                            <Text className="text-slate-400 text-xs">
                                Câu {currentIndex + 1}/{questions.length}
                            </Text>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question Content */}
                    <Box className="flex-1 px-4 py-4 overflow-y-auto pb-32">
                        {currentQuestion && (
                            <div className="space-y-4">
                                {/* Question Text */}
                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                                    <Text className="text-white text-base leading-relaxed whitespace-pre-wrap">
                                        {currentQuestion.content}
                                    </Text>
                                </div>

                                {/* Answers */}
                                <div className="space-y-2">
                                    {currentQuestion.answers.map((answer, idx) => {
                                        const isCorrect = answer.isCorrect === true;

                                        // Check if user selected this answer
                                        const userAnswer = result.userAnswers?.find(
                                            ua => ua.questionId === currentQuestion.id
                                        );
                                        const isUserSelected = userAnswer?.answerId === answer.id;
                                        const isUserWrong = isUserSelected && !isCorrect;

                                        let bgColor = "bg-slate-800/40 border-white/5";
                                        let circleColor = "bg-slate-700 text-slate-400";
                                        let textColor = "text-slate-300";

                                        if (isCorrect) {
                                            bgColor = "bg-green-500/20 border-green-500/50";
                                            circleColor = "bg-green-500 text-white";
                                            textColor = "text-white";
                                        } else if (isUserWrong) {
                                            bgColor = "bg-red-500/20 border-red-500/50";
                                            circleColor = "bg-red-500 text-white";
                                            textColor = "text-white";
                                        }

                                        return (
                                            <div
                                                key={answer.id}
                                                className={`border rounded-xl p-4 ${bgColor}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${circleColor}`}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    <Text className={`flex-1 text-sm ${textColor}`}>
                                                        {answer.content}
                                                    </Text>
                                                    {isCorrect && (
                                                        <Icon icon="zi-check-circle-solid" className="text-green-400" />
                                                    )}
                                                    {isUserWrong && (
                                                        <Icon icon="zi-close-circle-solid" className="text-red-400" />
                                                    )}
                                                </div>
                                                {isUserSelected && (
                                                    <div className="mt-2 ml-10">
                                                        <Text className={`text-xs ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                                            ← Bạn đã chọn
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {currentQuestion.explanation && (
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon icon="zi-info-circle" className="text-blue-400" />
                                            <Text className="text-blue-400 font-bold text-sm">Giải thích</Text>
                                        </div>
                                        <Text className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                            {currentQuestion.explanation}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        )}
                    </Box>

                    {/* Navigation Footer */}
                    <Box className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-slate-900/95 backdrop-blur-md border-t border-white/5">
                        <div className="flex gap-3">
                            <button
                                className="flex-1 h-12 bg-slate-800 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                            >
                                <Icon icon="zi-chevron-left" /> Trước
                            </button>

                            {currentIndex === questions.length - 1 ? (
                                <button
                                    className="flex-1 h-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center"
                                    onClick={() => navigate(-1)}
                                >
                                    Hoàn thành
                                </button>
                            ) : (
                                <button
                                    className="flex-1 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-1"
                                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                                >
                                    Tiếp <Icon icon="zi-chevron-right" />
                                </button>
                            )}
                        </div>

                        {/* Question Navigator (dots) */}
                        <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
                            {questions.map((q, idx) => {
                                const isCurrent = idx === currentIndex;
                                return (
                                    <div
                                        key={q.id}
                                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${isCurrent ? "bg-cyan-400 scale-125" : "bg-slate-700"}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    ></div>
                                );
                            })}
                        </div>
                    </Box>
                </>
            )}

            {/* No questions state */}
            {questions.length === 0 && !isLoading && (
                <Box className="flex-1 flex flex-col items-center justify-center px-6">
                    <Icon icon="zi-note" className="text-slate-500 text-4xl mb-3" />
                    <Text className="text-slate-400 text-sm mb-4">Không có câu hỏi để xem lại</Text>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-medium"
                    >
                        Quay lại
                    </button>
                </Box>
            )}
        </Page>
    );
};

export default HistoryDetailPage;
