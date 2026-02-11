import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, Spinner, useNavigate, useSnackbar } from "zmp-ui";
import { noteService, Note } from "@/services/note";

const NotesPage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchNotes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await noteService.getAllNotes();
            setNotes(data);
        } catch (err: any) {
            setError(err.message || "Không thể tải ghi chú");
            console.error("Fetch notes error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDelete = async (noteId: number) => {
        setDeletingId(noteId);
        try {
            await noteService.deleteNote(noteId);
            setNotes((prev) => prev.filter((n) => n.id !== noteId));
            openSnackbar({
                icon: true,
                text: "Đã xóa ghi chú",
                type: "success",
                duration: 2000,
            });
        } catch (err: any) {
            openSnackbar({
                icon: true,
                text: err.message || "Không thể xóa ghi chú",
                type: "error",
                duration: 3000,
            });
        } finally {
            setDeletingId(null);
        }
    };

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

    const truncateText = (text: string, maxLen: number) => {
        if (text.length <= maxLen) return text;
        return text.substring(0, maxLen) + "...";
    };

    // Filter notes by search query
    const filteredNotes = notes.filter((note) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            note.content.toLowerCase().includes(q) ||
            note.question?.content?.toLowerCase().includes(q) ||
            note.question?.exam?.title?.toLowerCase().includes(q) ||
            note.question?.exam?.course?.title?.toLowerCase().includes(q) ||
            note.course?.title?.toLowerCase().includes(q)
        );
    });

    if (isLoading) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center">
                <Spinner visible />
                <Text className="text-slate-400 text-sm mt-3">Đang tải ghi chú...</Text>
            </Page>
        );
    }

    if (error) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen items-center justify-center px-6">
                <Icon icon="zi-warning" className="text-red-400 text-4xl mb-3" />
                <Text className="text-red-400 text-sm mb-4">{error}</Text>
                <button
                    onClick={fetchNotes}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    Thử lại
                </button>
            </Page>
        );
    }

    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <Box className="sticky top-0 z-40 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                        onClick={() => navigate(-1)}
                    >
                        <Icon icon="zi-arrow-left" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text.Title className="text-white !text-lg !font-bold">
                            Ghi chú của tôi
                        </Text.Title>
                        <Text className="text-slate-400 text-xs">
                            {notes.length} ghi chú
                        </Text>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Icon icon="zi-post" className="text-amber-400" />
                    </div>
                </div>

                {/* Search Bar */}
                {notes.length > 0 && (
                    <div className="mt-3 relative">
                        <Icon icon="zi-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ghi chú..."
                            className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setSearchQuery("")}
                            >
                                <Icon icon="zi-close" className="text-slate-500" />
                            </button>
                        )}
                    </div>
                )}
            </Box>

            {/* Content */}
            <Box className="flex-1 px-4 py-4 overflow-y-auto">
                {notes.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center mb-4">
                            <Icon icon="zi-post" className="text-slate-600 text-3xl" />
                        </div>
                        <Text className="text-white font-bold text-base mb-2">
                            Chưa có ghi chú nào
                        </Text>
                        <Text className="text-slate-500 text-sm text-center max-w-[250px]">
                            Bạn có thể thêm ghi chú khi làm bài thi bằng cách nhấn nút "Thêm ghi chú" ở mỗi câu hỏi
                        </Text>
                        <button
                            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl text-sm font-medium"
                            onClick={() => navigate("/exams")}
                        >
                            Đi đến đề thi
                        </button>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    /* No search results */
                    <div className="flex flex-col items-center justify-center py-20">
                        <Icon icon="zi-search" className="text-slate-600 text-3xl mb-3" />
                        <Text className="text-slate-400 text-sm">
                            Không tìm thấy ghi chú phù hợp
                        </Text>
                    </div>
                ) : (
                    /* Notes List */
                    <div className="space-y-3">
                        {filteredNotes.map((note) => {
                            const isExpanded = expandedId === note.id;
                            const isDeleting = deletingId === note.id;
                            const courseName = note.question?.exam?.course?.title || note.course?.title;
                            const examName = note.question?.exam?.title;
                            const questionPreview = note.question?.content
                                ? truncateText(note.question.content, 80)
                                : null;

                            return (
                                <div
                                    key={note.id}
                                    className={`bg-slate-800/40 border rounded-2xl overflow-hidden transition-all ${isExpanded
                                            ? "border-amber-500/30"
                                            : "border-white/5"
                                        } ${isDeleting ? "opacity-50 scale-[0.98]" : ""}`}
                                >
                                    {/* Note Header - Clickable */}
                                    <div
                                        className="p-4 cursor-pointer active:bg-slate-700/20 transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : note.id)}
                                    >
                                        {/* Tags Row */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {courseName && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                                    {courseName}
                                                </span>
                                            )}
                                            {examName && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                                    {truncateText(examName, 30)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Question Preview */}
                                        {questionPreview && (
                                            <div className="flex items-start gap-2 mb-2">
                                                <Icon icon="zi-chat" className="text-slate-500 mt-0.5 flex-shrink-0" />
                                                <Text className="text-slate-400 text-xs leading-relaxed">
                                                    {questionPreview}
                                                </Text>
                                            </div>
                                        )}

                                        {/* Note Content Preview */}
                                        <div className="flex items-start gap-2">
                                            <div className="w-1 h-full min-h-[20px] bg-amber-500/40 rounded-full flex-shrink-0 mt-0.5"></div>
                                            <Text className="text-white text-sm leading-relaxed flex-1">
                                                {isExpanded
                                                    ? note.content
                                                    : truncateText(note.content, 120)}
                                            </Text>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-3">
                                            <Text className="text-slate-600 text-xs">
                                                {formatDate(note.updatedAt)}
                                            </Text>
                                            <Icon
                                                icon={isExpanded ? "zi-chevron-up" : "zi-chevron-down"}
                                                className="text-slate-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Expanded Actions */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-0 border-t border-white/5">
                                            <div className="flex gap-2 mt-3">
                                                {note.question?.exam?.id && (
                                                    <button
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 text-xs font-medium"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/exam?id=${note.question!.exam!.id}`);
                                                        }}
                                                    >
                                                        <Icon icon="zi-arrow-right" className="text-cyan-400" />
                                                        Đi đến đề thi
                                                    </button>
                                                )}
                                                <button
                                                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(note.id);
                                                    }}
                                                    disabled={isDeleting}
                                                >
                                                    <Icon icon="zi-close" className="text-red-400" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Box>
        </Page>
    );
};

export default NotesPage;
