import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdLock, MdVisibility, MdVisibilityOff, MdDone, MdArrowForward, MdShield, MdPassword, MdInfo } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ChangePassword = () => {
    // State for form inputs
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State for password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Get user info from Redux store
    const { user, baseURL } = useSelector((state) => state.auth);

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 25;

        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        return strength;
    };

    const passwordStrength = calculatePasswordStrength(newPassword);

    // Enhanced strength label and color function
    const getStrengthLabel = (strength) => {
        if (strength === 0) return { text: "", color: "bg-gray-200", textColor: "text-gray-500" };
        if (strength <= 25) return { text: "Lemah", color: "bg-red-500", textColor: "text-red-600" };
        if (strength <= 50) return { text: "Cukup", color: "bg-orange-500", textColor: "text-orange-600" };
        if (strength <= 75) return { text: "Baik", color: "bg-yellow-500", textColor: "text-yellow-600" };
        return { text: "Kuat", color: "bg-green-500", textColor: "text-green-600" };
    };

    const strengthInfo = getStrengthLabel(passwordStrength);

    // Update the isFormValid function to always return true (no restrictions)
    const isFormValid = () => {
        // Allow any input (no validation)
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous errors
        setErrorMessage(null);

        // Basic check just to ensure passwords match, but doesn't restrict submission
        if (newPassword !== confirmPassword) {
            setErrorMessage("Kata sandi tidak cocok");
            toast.warning("Kata sandi tidak cocok");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await baseURL.post("/api/change-password", {
                currentPassword,
                newPassword,
                userId: user.user_id // Updated to use the correct property name
            });

            if (response.data.success) {
                setIsSuccess(true);
                toast.success("Kata sandi berhasil diubah");

                // Reset form after 3 seconds
                setTimeout(() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setIsSuccess(false);
                }, 3000);
            } else {
                setErrorMessage(response.data.message || "Gagal mengubah kata sandi");
                toast.error(response.data.message || "Gagal mengubah kata sandi");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            const message = error.response?.data?.message || "Kata sandi saat ini salah";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-3 grid h-full grid-cols-1 gap-5 md:mt-5">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl mx-auto"
            >
                {/* User Information Card - Enhanced Design */}
                <Card extra={"p-6 mb-6 overflow-hidden relative"}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1.5">
                                {user?.fullname || "Memuat..."}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                {user?.email || ""}
                            </p>
                            <div className="flex items-center mt-1.5 space-x-2">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${user?.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    } shadow-sm`}>
                                    {user?.status || "tidak diketahui"}
                                </span>

                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${user?.role === "admin"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                    } shadow-sm`}>
                                    {user?.role || "pengguna"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-12 h-12 mb-2 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-400/20">
                                <MdLock className="h-6 w-6 text-white" />
                            </motion.div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-navy-800 rounded-full px-2.5 py-1">
                                Akun dibuat: {user?.created_at || "N/A"}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Password Change Card - Enhanced Design */}
                <Card extra={"p-0 overflow-hidden"}>
                    <div className="h-2 bg-gradient-to-r from-purple-500 via-brand-500 to-blue-500"></div>
                    <div className="p-6 sm:p-8">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center py-12"
                                >
                                    <motion.div
                                        className="rounded-full bg-gradient-to-br from-green-400 to-green-500 p-6 mb-6 shadow-xl shadow-green-200 dark:shadow-green-900/20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                            delay: 0.1
                                        }}
                                    >
                                        <MdDone className="h-16 w-16 text-white" />
                                    </motion.div>
                                    <motion.h2
                                        className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Kata Sandi Berhasil Diubah
                                    </motion.h2>
                                    <motion.p
                                        className="text-center text-gray-600 dark:text-gray-400 max-w-md"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Kata sandi Anda telah diperbarui dengan aman. Anda dapat melanjutkan menggunakan akun Anda dengan kredensial baru.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-6"
                                    >
                                        <span className="text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/30">
                                            Selesai pada {new Date().toLocaleTimeString()}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="flex items-center justify-between gap-3 mb-8">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1.5">
                                                Perbarui Kata Sandi Anda
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-0.5">
                                                Silakan masukkan kata sandi saat ini untuk melakukan perubahan ini
                                            </p>
                                        </div>
                                        <motion.div
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-brand-500 shadow-lg shadow-brand-500/20"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MdPassword className="h-7 w-7 text-white" />
                                        </motion.div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Error Message - Enhanced */}
                                        {errorMessage && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 mb-3 bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-500/50 rounded-md shadow-sm"
                                            >
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Current Password - Enhanced */}
                                        <motion.div
                                            className="space-y-1.5 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-700"
                                            whileHover={{ y: -2 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Kata Sandi Saat Ini
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MdLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <input
                                                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-navy-700 dark:border-navy-600 dark:text-white dark:placeholder-gray-400"
                                                    placeholder="Masukkan kata sandi saat ini"
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => {
                                                        setCurrentPassword(e.target.value);
                                                        setErrorMessage(null);
                                                    }}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? (
                                                        <MdVisibilityOff className="h-5 w-5" />
                                                    ) : (
                                                        <MdVisibility className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>

                                        <div className="w-full flex items-center justify-center my-6">
                                            <div className="w-full h-px bg-gray-200 dark:bg-navy-700"></div>
                                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-navy-800 whitespace-nowrap">Kata Sandi Baru</span>
                                            <div className="w-full h-px bg-gray-200 dark:bg-navy-700"></div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-navy-800 shadow-inner">
                                            <div className="flex items-center gap-2 mb-4">
                                                <MdInfo className="h-5 w-5 text-brand-500" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Kata sandi baru Anda harus berbeda dari kata sandi sebelumnya
                                                </p>
                                            </div>

                                            {/* New Password - Enhanced */}
                                            <motion.div
                                                className="space-y-1.5 mb-5 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm"
                                                whileHover={{ y: -2 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Kata Sandi Baru
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MdLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <input
                                                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-navy-700 dark:border-navy-600 dark:text-white dark:placeholder-gray-400"
                                                        placeholder="Masukkan kata sandi baru"
                                                        id="newPassword"
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value);
                                                            setErrorMessage(null);
                                                        }}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? (
                                                            <MdVisibilityOff className="h-5 w-5" />
                                                        ) : (
                                                            <MdVisibility className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Enhanced Password strength indicator */}
                                                {newPassword && (
                                                    <motion.div
                                                        className="mt-3 space-y-2 p-4 bg-gray-50 dark:bg-navy-900 rounded-lg"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                Kekuatan Kata Sandi:
                                                            </div>
                                                            <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${strengthInfo.color === 'bg-red-500' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                                strengthInfo.color === 'bg-orange-500' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                    strengthInfo.color === 'bg-yellow-500' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                        strengthInfo.color === 'bg-green-500' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                                }`}>
                                                                {strengthInfo.text || 'Tidak Ada'}
                                                            </div>
                                                        </div>

                                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-navy-700 overflow-hidden">
                                                            <motion.div
                                                                className={`h-full rounded-full ${strengthInfo.color}`}
                                                                initial={{ width: "0%" }}
                                                                animate={{ width: `${passwordStrength}%` }}
                                                                transition={{ duration: 0.5 }}
                                                            />
                                                        </div>

                                                        {/* Enhanced Password requirements */}
                                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                            <div className={`flex items-center gap-2 text-xs bg-white dark:bg-navy-800 p-2 rounded-lg ${newPassword.length >= 8 ? "text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30" : "text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800"}`}>
                                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${newPassword.length >= 8 ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                                                    {newPassword.length >= 8 ? <MdDone className="h-3 w-3" /> : ""}
                                                                </div>
                                                                Minimal 8 karakter
                                                            </div>

                                                            <div className={`flex items-center gap-2 text-xs bg-white dark:bg-navy-800 p-2 rounded-lg ${/[A-Z]/.test(newPassword) ? "text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30" : "text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800"}`}>
                                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[A-Z]/.test(newPassword) ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                                                    {/[A-Z]/.test(newPassword) ? <MdDone className="h-3 w-3" /> : ""}
                                                                </div>
                                                                Satu huruf kapital
                                                            </div>

                                                            <div className={`flex items-center gap-2 text-xs bg-white dark:bg-navy-800 p-2 rounded-lg ${/[0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30" : "text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800"}`}>
                                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[0-9]/.test(newPassword) ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                                                    {/[0-9]/.test(newPassword) ? <MdDone className="h-3 w-3" /> : ""}
                                                                </div>
                                                                Satu angka
                                                            </div>

                                                            <div className={`flex items-center gap-2 text-xs bg-white dark:bg-navy-800 p-2 rounded-lg ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30" : "text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800"}`}>
                                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                                                    {/[^A-Za-z0-9]/.test(newPassword) ? <MdDone className="h-3 w-3" /> : ""}
                                                                </div>
                                                                Satu karakter khusus
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>

                                            {/* Confirm Password - Enhanced */}
                                            <motion.div
                                                className="space-y-1.5 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm"
                                                whileHover={{ y: -2 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Konfirmasi Kata Sandi
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MdLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <input
                                                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-navy-700 dark:border-navy-600 dark:text-white dark:placeholder-gray-400"
                                                        placeholder="Konfirmasi kata sandi baru Anda"
                                                        id="confirmPassword"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            setErrorMessage(null);
                                                        }}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <MdVisibilityOff className="h-5 w-5" />
                                                        ) : (
                                                            <MdVisibility className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Enhanced Password match indicator */}
                                                {confirmPassword && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="mt-2 flex items-center gap-2 p-2 rounded-lg"
                                                    >
                                                        {newPassword === confirmPassword ? (
                                                            <>
                                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                                    <MdDone className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Kata sandi cocok</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                                    <svg className="h-3 w-3 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Kata sandi tidak cocok</p>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Enhanced Submit Button */}
                                        <div className="pt-6">
                                            <motion.button
                                                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="linear flex w-full items-center justify-center gap-2 rounded-xl py-4 px-4 font-medium transition-all bg-gradient-to-r from-brand-400 to-brand-600 text-white hover:from-brand-500 hover:to-brand-700 active:from-brand-600 active:to-brand-800 shadow-lg shadow-brand-500/20"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                                        <span className="ml-2">Memproses...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <MdShield className="h-5 w-5" />
                                                        Perbarui Kata Sandi
                                                        <MdArrowForward className="h-5 w-5" />
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ChangePassword;