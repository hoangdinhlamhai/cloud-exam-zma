import React, { useState, useRef, useEffect, useCallback } from "react";
import { Page, Box, Text, Icon, useNavigate, useSnackbar } from "zmp-ui";
import { profileService, UserProfile, UserStats } from "@/services/profile";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── profile data from API ── */
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /* ── editable state ── */
    const [fullName, setFullName] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    /* ── ui state ── */
    const [activeTab, setActiveTab] = useState<"info" | "password">("info");
    const [isSaving, setIsSaving] = useState(false);

    /* helpers */
    const showToast = (text: string, type: "success" | "error" = "success") => {
        openSnackbar({
            text,
            type: type === "success" ? "success" : "error",
            duration: 3000,
        });
    };

    /* ── Fetch profile + stats on mount ── */
    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const [profileData, statsData] = await Promise.all([
                profileService.getProfile(),
                profileService.getStats().catch(() => null),
            ]);
            setProfile(profileData);
            setFullName(profileData.fullName || "");
            setAvatarPreview(profileData.avatarUrl || null);
            if (statsData) setStats(statsData);
        } catch {
            showToast("Không thể tải thông tin hồ sơ", "error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const initials = (fullName || profile?.email || "U")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    /* ── avatar file handler ── */
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Vui lòng chọn file ảnh (jpg, png, webp…)", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast("Ảnh quá lớn. Tối đa 5MB", "error");
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            setIsUploading(true);
            const updatedUser = await profileService.uploadAvatar(file);
            setProfile(updatedUser);
            setAvatarPreview(updatedUser.avatarUrl);
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            showToast("Tải ảnh đại diện thành công!");
        } catch (err: any) {
            showToast(err.message || "Lỗi khi tải ảnh đại diện", "error");
            setAvatarPreview(profile?.avatarUrl || null);
            setAvatarFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!profile?.avatarUrl) {
            setAvatarPreview(null);
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        try {
            setIsUploading(true);
            const updatedUser = await profileService.deleteAvatar();
            setProfile(updatedUser);
            setAvatarPreview(null);
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            showToast("Đã xoá ảnh đại diện!");
        } catch (err: any) {
            showToast(err.message || "Lỗi khi xoá ảnh đại diện", "error");
        } finally {
            setIsUploading(false);
        }
    };

    /* ── Save profile (fullName) ── */
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await profileService.updateProfile({ fullName });
            setProfile(updatedUser);
            showToast("Cập nhật hồ sơ thành công!");
        } catch (err: any) {
            showToast(err.message || "Lỗi khi cập nhật hồ sơ", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }
        if (newPassword.length < 6) {
            showToast("Mật khẩu mới phải có ít nhất 6 ký tự", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast("Xác nhận mật khẩu không khớp", "error");
            return;
        }
        setIsSaving(true);
        try {
            await profileService.updateProfile({ currentPassword, newPassword });
            showToast("Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            showToast(err.message || "Lỗi khi đổi mật khẩu", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    /* ── LOADING STATE ── */
    if (isLoading) {
        return (
            <Page className="bg-slate-900 flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button
                            className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center"
                            onClick={() => navigate(-1)}
                        >
                            <span className="text-white">←</span>
                        </button>
                        <Text.Title className="text-white !text-lg !font-bold">Hồ sơ</Text.Title>
                    </div>
                </header>
                <Box className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <Text className="text-slate-400 text-sm">Đang tải...</Text>
                    </div>
                </Box>
            </Page>
        );
    }

    /* ── RENDER ── */
    return (
        <Page className="bg-slate-900 flex flex-col min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        className="w-9 h-9 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <span className="text-white">←</span>
                    </button>
                    <div>
                        <Text.Title className="text-white !text-lg !font-bold">Hồ sơ cá nhân</Text.Title>
                        <Text className="text-slate-400 text-xs">Quản lý thông tin tài khoản</Text>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <Box className="flex-1 px-4 py-4 overflow-y-auto pb-20">

                {/* ═══ HERO — Avatar + Info ═══ */}
                <Box className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-white/5 mb-4">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center gap-4 relative z-10">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-40 blur-sm"></div>
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={fullName}
                                    className="relative w-20 h-20 rounded-full object-cover border-2 border-slate-900"
                                />
                            ) : (
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-slate-900 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">{initials}</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <Text.Title className="text-white !text-xl !font-bold truncate">
                                {fullName || "Chưa đặt tên"}
                            </Text.Title>
                            <Text className="text-slate-400 text-sm truncate">{profile?.email}</Text>
                            <Text className="text-slate-500 text-xs mt-1">Thành viên từ {memberSince}</Text>
                        </div>
                    </div>
                </Box>

                {/* ═══ Stats Grid ═══ */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        { label: "Đề thi đã làm", value: stats?.totalExamsTaken ?? "—", emoji: "📝", color: "from-cyan-500/15 to-blue-500/15 border-cyan-500/20" },
                        { label: "Điểm TB", value: stats ? `${stats.averageScore}%` : "—", emoji: "📊", color: "from-green-500/15 to-emerald-500/15 border-green-500/20" },
                        { label: "Câu đã trả lời", value: stats?.totalQuestions?.toLocaleString() ?? "—", emoji: "💡", color: "from-purple-500/15 to-pink-500/15 border-purple-500/20" },
                        { label: "Ghi chú", value: stats?.totalNotes ?? "—", emoji: "📌", color: "from-amber-500/15 to-orange-500/15 border-amber-500/20" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-2xl border bg-gradient-to-br p-4 ${stat.color}`}
                        >
                            <span className="text-lg">{stat.emoji}</span>
                            <p className="mt-1 text-xl font-extrabold text-white">{stat.value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ═══ Tab Switcher ═══ */}
                <div className="flex gap-1 p-1 rounded-xl bg-slate-800/60 border border-white/5 mb-4">
                    {([
                        { key: "info" as const, label: "Hồ sơ", emoji: "👤" },
                        { key: "password" as const, label: "Mật khẩu", emoji: "🔒" },
                    ]).map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${activeTab === tab.key
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                : "text-slate-400"
                                }`}
                        >
                            <span className="text-sm">{tab.emoji}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ═══ Tab: Profile Info ═══ */}
                {activeTab === "info" && (
                    <div className="space-y-4">
                        {/* Avatar Upload Card */}
                        <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                            <Text className="text-white font-bold text-sm mb-4">Ảnh đại diện</Text>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center gap-4">
                                {/* Preview */}
                                <div className="relative">
                                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-30 blur-sm"></div>
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={fullName}
                                            className="relative w-28 h-28 rounded-full object-cover border-2 border-slate-900"
                                        />
                                    ) : (
                                        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-900 flex items-center justify-center">
                                            <span className="text-2xl font-black text-slate-500">{initials}</span>
                                        </div>
                                    )}
                                </div>

                                {avatarFile && (
                                    <div className="text-center">
                                        <Text className="text-xs text-slate-400 truncate max-w-[200px]">{avatarFile.name}</Text>
                                        <Text className="text-xs text-slate-600">{(avatarFile.size / 1024).toFixed(0)} KB</Text>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex flex-col gap-2 w-full">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                                Đang tải lên…
                                            </>
                                        ) : (
                                            <>📷 {avatarPreview ? "Đổi ảnh" : "Tải ảnh lên"}</>
                                        )}
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            onClick={handleRemoveAvatar}
                                            className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400"
                                        >
                                            Xóa ảnh
                                        </button>
                                    )}
                                </div>

                                <Text className="text-xs text-slate-600 text-center">JPG, PNG hoặc WebP — Tối đa 5MB</Text>
                            </div>
                        </div>

                        {/* Profile Fields Card */}
                        <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                            <Text className="text-white font-bold text-sm mb-4">Thông tin cá nhân</Text>

                            <div className="space-y-4">
                                {/* Email (read-only) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Email</label>
                                    <div className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-3 text-sm text-slate-500">
                                        {profile?.email || "—"}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">Email không thể thay đổi</p>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        maxLength={100}
                                        placeholder="Nhập họ và tên…"
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                </div>

                                {/* Member since (read-only) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Ngày tham gia</label>
                                    <div className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-3 text-sm text-slate-500">
                                        {memberSince}
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="mt-5">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang lưu…
                                        </>
                                    ) : (
                                        "💾 Lưu thay đổi"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Tab: Change Password ═══ */}
                {activeTab === "password" && (
                    <div className="space-y-4">
                        {/* Password Form Card */}
                        <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                            <Text className="text-white font-bold text-sm mb-1">Đổi mật khẩu</Text>
                            <Text className="text-slate-500 text-xs mb-5">Mật khẩu mới phải có ít nhất 6 ký tự</Text>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Tối thiểu 6 ký tự"
                                        minLength={6}
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                    {newPassword && newPassword.length < 6 && (
                                        <p className="text-xs text-red-400 mt-1.5">Mật khẩu phải có ít nhất 6 ký tự</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-xs text-red-400 mt-1.5">Mật khẩu xác nhận không khớp</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang xử lý…
                                        </>
                                    ) : (
                                        "🔐 Đổi mật khẩu"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Security Tips */}
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">⚡</span>
                                <div>
                                    <Text className="text-amber-400 font-bold text-sm mb-2">Lưu ý bảo mật</Text>
                                    <ul className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
                                        <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                                        <li>• Không sử dụng lại mật khẩu từ dịch vụ khác</li>
                                        <li>• Đổi mật khẩu định kỳ để tăng bảo mật</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Danger Zone — Logout ═══ */}
                <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <Text className="text-red-400 font-bold text-sm mb-0.5">Đăng xuất</Text>
                            <Text className="text-slate-400 text-xs">Cần đăng nhập lại để tiếp tục</Text>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 flex-shrink-0"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </Box>
        </Page>
    );
};

export default ProfilePage;
