"use client";

import { useState, useEffect } from "react";
import { ContentTemplate } from "@/types/api";
import { contentTemplateService } from "@/lib/api/admin/content-templates";

interface ModalProps {
    show: boolean;
    template: ContentTemplate;
    onClose: () => void;
}

export default function ContentTemplateTestModal({
    show,
    template,
    onClose,
}: ModalProps) {
    const [loading, setLoading] = useState(false);
    const [to, setTo] = useState("");
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);

    useEffect(() => {
        if (template.variables) {
            const initialVars: Record<string, string> = {};
            const varList = Array.isArray(template.variables) ? template.variables : Object.keys(template.variables);
            varList.forEach((v: string) => {
                initialVars[v] = "";
            });
            setVariables(initialVars);
        }
    }, [template]);

    const handleVarChange = (name: string, value: string) => {
        setVariables(prev => ({ ...prev, [name]: value }));
    };

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await contentTemplateService.test(template.id, {
                to,
                variables,
            });
            setResult({ success: res.success || true, message: "Gửi thử thành công!" });
        } catch (err: any) {
            setResult({
                success: false,
                message: err.response?.data?.message || err.message || "Gửi thử thất bại"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Gửi thử Template</h3>
                        <p className="text-xs text-gray-500">{template.name} ({template.code})</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleTest} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Người nhận (To)</label>
                        <input
                            type="text"
                            required
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder={template.type === 'email' ? 'email@example.com' : 'Phone / ChatID...'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700">Biến nội dung (Variables)</label>
                        <div className="grid grid-cols-1 gap-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                            {Object.keys(variables).length > 0 ? (
                                Object.keys(variables).map((v) => (
                                    <div key={v} className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">{v}</label>
                                        <input
                                            type="text"
                                            value={variables[v]}
                                            onChange={(e) => handleVarChange(v, e.target.value)}
                                            placeholder={`Nhập giá trị cho ${v}`}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">Template này không có biến nào.</p>
                            )}
                        </div>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-lg text-sm border ${result.success ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                            {result.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50"
                        >
                            {loading ? "Đang gửi..." : "Gửi ngay"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


