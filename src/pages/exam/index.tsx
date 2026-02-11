import React, { useEffect, useState, useCallback } from "react";
import { Page, Box, Text, Icon, Spinner, Button, useNavigate, useSnackbar } from "zmp-ui";
import { useSearchParams } from "zmp-ui";
import { examService, Exam } from "@/services/exam";
import { questionService, Question } from "@/services/question";
import { examResultService, ExamSubmissionResponse, QuestionResult } from "@/services/examResult";
import { noteService } from "@/services/note";

// State for user answers
type UserAnswers = Record<number, number>; // questionId -> answerId
type AnswerResults = Record<number, QuestionResult>; // questionId -> result
type QuestionNotes = Record<number, string>; // questionId -> note content

const ExamPage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const examId = searchParams.get("id");

    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [answerResults, setAnswerResults] = useState<AnswerResults>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<ExamSubmissionResponse | null>(null);
    const [isQuestionDrawerOpen, setIsQuestionDrawerOpen] = useState(false);
    const [questionNotes, setQuestionNotes] = useState<QuestionNotes>({});
    const [openNoteId, setOpenNoteId] = useState<number | null>(null); // which question's note is open
    const [isSavingNote, setIsSavingNote] = useState(false);

    const fetchExamData = useCallback(async () => {
        if (!examId) return;
        setIsLoading(true);
        setError(null);
        try {
            // Fetch exam details
            const examData = await examService.getById(parseInt(examId));
            setExam(examData);

            // Fetch questions (without correct answers)
            const questionsData = await questionService.getByExam(parseInt(examId), false);
            setQuestions(questionsData);
        } catch (err: any) {
            setError(err.message || "Không thể tải đề thi");
            console.error("Fetch exam error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [examId]);

    useEffect(() => {
        fetchExamData();
    }, [fetchExamData]);

    const handleSelectAnswer = (questionId: number, answerId: number) => {
        if (isSubmitted) return;
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleSubmit = async () => {
        if (!examId) return;

        const answeredCount = Object.keys(userAnswers).length;
        if (answeredCount < questions.length) {
            openSnackbar({
                icon: true,
                text: `Bạn còn ${questions.length - answeredCount} câu chưa trả lời!`,
                type: "warning",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert userAnswers to array format for API
            const answersArray = Object.entries(userAnswers).map(([questionId, answerId]) => ({
                questionId: parseInt(questionId),
                answerId,
            }));

            // Submit exam using the new examResultService
            const result = await examResultService.submitExam(parseInt(examId), answersArray);
            setSubmissionResult(result);

            // Convert details array to map for easy lookup
            const resultsMap: AnswerResults = {};
            result.details.forEach((detail) => {
                resultsMap[detail.questionId] = detail;
            });
            setAnswerResults(resultsMap);
            setIsSubmitted(true);

            // Show success message
            openSnackbar({
                icon: true,
                text: `Nộp bài thành công! Điểm: ${result.score}%`,
                type: result.score >= 70 ? "success" : "warning",
                duration: 3000,
            });

        } catch (err: any) {
            openSnackbar({
                icon: true,
                text: err.message || "Không thể nộp bài",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        Object.values(answerResults).forEach((result) => {
            if (result.isCorrect) correct++;
        });
        const total = questions.length;
        return { correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : 0 };
    };

    const currentQuestion = questions[currentIndex];

    const handleSaveNote = async (questionId: number) => {
        const content = questionNotes[questionId];
        if (!content?.trim()) return;

        setIsSavingNote(true);
        try {
            await noteService.saveNote({
                questionId,
                content: content.trim(),
            });
            openSnackbar({
                icon: true,
                text: "Đã lưu ghi chú",
                type: "success",
                duration: 2000,
            });
            setOpenNoteId(null);
        } catch (err: any) {
            openSnackbar({
                icon: true,
                text: err.message || "Không thể lưu ghi chú",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleDeleteNote = async (questionId: number) => {
        setQuestionNotes((prev) => {
            const next = { ...prev };
            delete next[questionId];
            return next;
        });
        openSnackbar({
            icon: true,
            text: "Đã xóa ghi chú",
            type: "success",
            duration: 2000,
        });
    };

    if (isLoading) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center">
                <Spinner visible />
                <Text className="text-slate-400 text-sm mt-3">Đang tải đề thi...</Text>
            </Page>
        );
    }

    if (error) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center px-6">
                <Icon icon="zi-warning" className="text-red-400 text-4xl mb-3" />
                <Text className="text-red-400 text-sm mb-4">{error}</Text>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    Quay lại
                </button>
            </Page>
        );
    }

    if (!exam) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center px-6">
                <Icon icon="zi-warning" className="text-yellow-400 text-4xl mb-3" />
                <Text className="text-yellow-400 text-sm mb-4">Không tìm thấy đề thi (ID: {examId})</Text>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    Quay lại
                </button>
            </Page>
        );
    }

    if (questions.length === 0) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center px-6">
                <Icon icon="zi-note" className="text-slate-400 text-4xl mb-3" />
                <Text className="text-slate-400 text-sm mb-2">Đề thi: {exam.title}</Text>
                <Text className="text-slate-500 text-xs mb-4">Chưa có câu hỏi nào trong đề thi này</Text>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    Quay lại
                </button>
            </Page>
        );
    }

    const score = isSubmitted ? calculateScore() : null;

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <Box className="sticky top-0 z-50 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <Icon icon="zi-close" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text.Title className="text-white !text-base !font-bold truncate">
                            {exam.title}
                        </Text.Title>
                        <Text className="text-slate-400 text-xs">
                            Câu {currentIndex + 1}/{questions.length}
                        </Text>
                    </div>
                    {isSubmitted && score && (
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${score.percent >= 70 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {score.correct}/{score.total} ({score.percent}%)
                        </div>
                    )}
                </div>
            </Box>

            {/* Progress Bar */}
            <div className="px-4 py-2">
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
                                const isSelected = userAnswers[currentQuestion.id] === answer.id;
                                const result = answerResults[currentQuestion.id];
                                const isCorrectAnswer = isSubmitted && result && result.correctAnswerId === answer.id;
                                const isWrongSelection = isSubmitted && isSelected && result && !result.isCorrect;

                                let bgColor = "bg-slate-800/40 border-white/5";
                                if (isSubmitted) {
                                    if (isCorrectAnswer) {
                                        bgColor = "bg-green-500/20 border-green-500/50";
                                    } else if (isWrongSelection) {
                                        bgColor = "bg-red-500/20 border-red-500/50";
                                    }
                                } else if (isSelected) {
                                    bgColor = "bg-cyan-500/20 border-cyan-500/50";
                                }

                                return (
                                    <div
                                        key={answer.id}
                                        className={`border rounded-xl p-4 cursor-pointer transition-all ${bgColor} ${!isSubmitted ? "active:scale-[0.98]" : ""}`}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${isSelected ? "bg-cyan-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <Text className={`flex-1 text-sm ${isSelected || isCorrectAnswer ? "text-white" : "text-slate-300"}`}>
                                                {answer.content}
                                            </Text>
                                            {isSubmitted && isCorrectAnswer && (
                                                <Icon icon="zi-check-circle-solid" className="text-green-400" />
                                            )}
                                            {isSubmitted && isWrongSelection && (
                                                <Icon icon="zi-close-circle-solid" className="text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation (only after submission) */}
                        {isSubmitted && answerResults[currentQuestion.id]?.explanation && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon icon="zi-info-circle" className="text-blue-400" />
                                    <Text className="text-blue-400 font-bold text-sm">Giải thích</Text>
                                </div>
                                <Text className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {answerResults[currentQuestion.id].explanation}
                                </Text>
                            </div>
                        )}

                        {/* Note Section */}
                        <div className="mt-4">
                            {/* Note Toggle Button */}
                            <button
                                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${openNoteId === currentQuestion.id
                                    ? "bg-amber-500/10 border-amber-500/30"
                                    : questionNotes[currentQuestion.id]
                                        ? "bg-amber-500/5 border-amber-500/20"
                                        : "bg-slate-800/40 border-white/5 hover:border-white/10"
                                    }`}
                                onClick={() =>
                                    setOpenNoteId(
                                        openNoteId === currentQuestion.id ? null : currentQuestion.id
                                    )
                                }
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${questionNotes[currentQuestion.id]
                                    ? "bg-amber-500/20"
                                    : "bg-slate-700/50"
                                    }`}>
                                    <Icon
                                        icon="zi-post"
                                        className={questionNotes[currentQuestion.id] ? "text-amber-400" : "text-slate-400"}
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <Text className={`text-sm font-medium ${questionNotes[currentQuestion.id] ? "text-amber-400" : "text-slate-400"
                                        }`}>
                                        {questionNotes[currentQuestion.id] ? "Xem ghi chú" : "Thêm ghi chú"}
                                    </Text>
                                </div>
                                {questionNotes[currentQuestion.id] && (
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                )}
                                <Icon
                                    icon={openNoteId === currentQuestion.id ? "zi-chevron-up" : "zi-chevron-down"}
                                    className="text-slate-500"
                                />
                            </button>

                            {/* Note Editor (collapsible) */}
                            {openNoteId === currentQuestion.id && (
                                <div className="mt-2 bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-3 animate-slideDown">
                                    <textarea
                                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white text-sm placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
                                        rows={4}
                                        placeholder="Ghi chú của bạn cho câu hỏi này..."
                                        value={questionNotes[currentQuestion.id] || ""}
                                        onChange={(e) =>
                                            setQuestionNotes((prev) => ({
                                                ...prev,
                                                [currentQuestion.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <div className="flex items-center justify-between">
                                        <Text className="text-slate-500 text-xs">
                                            {(questionNotes[currentQuestion.id] || "").length} ký tự
                                        </Text>
                                        <div className="flex gap-2">
                                            {questionNotes[currentQuestion.id] && (
                                                <button
                                                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-400 text-xs hover:bg-slate-700 transition-colors"
                                                    onClick={() => handleDeleteNote(currentQuestion.id)}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                            <button
                                                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1"
                                                onClick={() => handleSaveNote(currentQuestion.id)}
                                                disabled={isSavingNote || !(questionNotes[currentQuestion.id]?.trim())}
                                            >
                                                {isSavingNote ? (
                                                    <span className="text-amber-400 text-xs">...</span>
                                                ) : (
                                                    <Icon icon="zi-check" className="text-amber-400" />
                                                )}
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Box>

            {/* Navigation Footer */}
            <Box className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-slate-900/95 backdrop-blur-md border-t border-white/5">
                <div className="flex gap-3">
                    <Button
                        className="!flex-1 !bg-slate-800 !text-white !rounded-xl !h-12 !border-0"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    >
                        <Icon icon="zi-chevron-left" className="mr-1" /> Trước
                    </Button>

                    {currentIndex === questions.length - 1 ? (
                        isSubmitted ? (
                            <Button
                                className="!flex-1 !bg-gradient-to-r !from-green-400 !to-emerald-500 !text-white !rounded-xl !h-12 !border-0 !font-bold"
                                onClick={() => navigate(-1)}
                            >
                                Hoàn thành
                            </Button>
                        ) : (
                            <Button
                                className="!flex-1 !bg-gradient-to-r !from-cyan-400 !to-blue-500 !text-white !rounded-xl !h-12 !border-0 !font-bold"
                                onClick={handleSubmit}
                                loading={isSubmitting}
                            >
                                Nộp bài
                            </Button>
                        )
                    ) : (
                        <Button
                            className="!flex-1 !bg-gradient-to-r !from-cyan-400 !to-blue-500 !text-white !rounded-xl !h-12 !border-0"
                            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                        >
                            Tiếp <Icon icon="zi-chevron-right" className="ml-1" />
                        </Button>
                    )}
                </div>

                {/* Question Navigator Button */}
                <div className="flex justify-center mt-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-slate-300 text-sm"
                        onClick={() => setIsQuestionDrawerOpen(true)}
                    >
                        <Icon icon="zi-list-1" className="text-cyan-400" />
                        <span>Câu {currentIndex + 1}/{questions.length}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-cyan-400">{Object.keys(userAnswers).length} đã làm</span>
                        <Icon icon="zi-chevron-up" className="text-slate-500" />
                    </button>
                </div>
            </Box>

            {/* Question Drawer Overlay */}
            {isQuestionDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 transition-opacity"
                    onClick={() => setIsQuestionDrawerOpen(false)}
                />
            )}

            {/* Question Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-3xl border-t border-white/10 transition-transform duration-300 ${isQuestionDrawerOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ maxHeight: "70vh" }}
            >
                {/* Drawer Handle */}
                <div className="flex justify-center py-3">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
                </div>

                {/* Drawer Header */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-white/5">
                    <div>
                        <Text className="text-white font-bold text-base">Danh sách câu hỏi</Text>
                        <Text className="text-slate-400 text-xs">
                            {Object.keys(userAnswers).length}/{questions.length} câu đã làm
                        </Text>
                    </div>
                    <button
                        className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
                        onClick={() => setIsQuestionDrawerOpen(false)}
                    >
                        <Icon icon="zi-close" className="text-slate-400" />
                    </button>
                </div>

                {/* Question Grid */}
                <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 100px)" }}>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = userAnswers[q.id] !== undefined;
                            const isCurrent = idx === currentIndex;
                            const result = answerResults[q.id];

                            let bgColor = "bg-slate-800 border-slate-700";
                            let textColor = "text-slate-400";

                            if (isSubmitted && result) {
                                if (result.isCorrect) {
                                    bgColor = "bg-green-500/20 border-green-500";
                                    textColor = "text-green-400";
                                } else {
                                    bgColor = "bg-red-500/20 border-red-500";
                                    textColor = "text-red-400";
                                }
                            } else if (isCurrent) {
                                bgColor = "bg-cyan-500/20 border-cyan-400";
                                textColor = "text-cyan-400";
                            } else if (isAnswered) {
                                bgColor = "bg-emerald-500/20 border-emerald-500";
                                textColor = "text-emerald-400";
                            }

                            return (
                                <button
                                    key={q.id}
                                    className={`aspect-square rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all active:scale-95 ${bgColor} ${textColor}`}
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        setIsQuestionDrawerOpen(false);
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <Text className="text-slate-500 text-xs">Chưa làm</Text>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <Text className="text-slate-500 text-xs">Đã làm</Text>
                        </div>
                        {isSubmitted && (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <Text className="text-slate-500 text-xs">Đúng</Text>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <Text className="text-slate-500 text-xs">Sai</Text>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default ExamPage;
