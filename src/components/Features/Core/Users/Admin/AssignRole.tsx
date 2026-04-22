"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

import { type AssignRoleProps, type AssignRoleTarget } from "./Constants/types";

type Id = string | number;

interface RoleTreeRow {
  role_id: Id;
  role_name?: string | null;
  checked?: boolean;
}

interface GroupTreeRow {
  group_id: Id;
  group_name?: string | null;
  checked?: boolean;
  indeterminate?: boolean;
  roles: RoleTreeRow[];
}


function normId(v: Id): string {
  return String(v);
}

function toNumId(v: Id): number {
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function parseTreePayload(raw: unknown): GroupTreeRow[] {
  const rows = Array.isArray(raw) ? raw : [];
  return rows.map((g: Record<string, any>) => ({
    group_id: g.group_id ?? g.groupId,
    group_name: g.group_name ?? g.groupName,
    checked: g.checked,
    indeterminate: g.indeterminate,
    roles: Array.isArray(g.roles)
      ? (g.roles as Record<string, any>[]).map((r: Record<string, any>) => ({
          role_id: r.role_id ?? r.roleId,
          role_name: r.role_name ?? r.roleName,
          checked: r.checked,
        }))
      : [],
  }));
}

function selectionsFromTree(tree: GroupTreeRow[]): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const g of tree) {
    const gid = normId(g.group_id);
    const ids = (g.roles || [])
      .filter((r) => r.checked)
      .map((r) => toNumId(r.role_id))
      .filter((n) => n > 0);
    out[gid] = [...new Set(ids)];
  }
  return out;
}

export default function AssignRole({
  show,
  target,
  onSuccess,
  onClose,
}: AssignRoleProps) {
  const [tree, setTree] = useState<GroupTreeRow[]>([]);
  const [baseline, setBaseline] = useState<Record<string, number[]>>({});
  const [selectionByGroup, setSelectionByGroup] = useState<Record<string, number[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loadingTree, setLoadingTree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useToastContext();

  const fetchTree = useCallback(async () => {
    if (!target?.user?.id) return;
    setLoadingTree(true);
    try {
      const response = await api.get(adminEndpoints.users.rolesTree(target.user.id));
      const raw = response.data?.data ?? response.data ?? [];
      const parsed = parseTreePayload(raw);
      setTree(parsed);
      const sel = selectionsFromTree(parsed);
      setSelectionByGroup(sel);
      setBaseline(JSON.parse(JSON.stringify(sel)) as Record<string, number[]>);
      const exp: Record<string, boolean> = {};
      parsed.forEach((g) => {
        exp[normId(g.group_id)] = true;
      });
      setExpanded(exp);
    } catch {
      showError("Không thể tải cây phân quyền (roles/tree)");
      setTree([]);
      setSelectionByGroup({});
      setBaseline({});
    } finally {
      setLoadingTree(false);
    }
  }, [target?.user?.id, showError]);

  useEffect(() => {
    if (show && target?.user?.id) {
      void fetchTree();
    } else if (!show) {
      setTree([]);
      setSelectionByGroup({});
      setBaseline({});
      setExpanded({});
    }
  }, [show, target?.user?.id, fetchTree]);

  const isDirty = useMemo(() => {
    const keys = new Set([...Object.keys(baseline), ...Object.keys(selectionByGroup)]);
    for (const k of keys) {
      const a = new Set((baseline[k] ?? []).sort((x, y) => x - y));
      const b = new Set((selectionByGroup[k] ?? []).sort((x, y) => x - y));
      if (a.size !== b.size) return true;
      for (const id of a) {
        if (!b.has(id)) return true;
      }
    }
    return false;
  }, [baseline, selectionByGroup]);

  const setRolesForGroup = (groupId: string, roleIds: number[]) => {
    setSelectionByGroup((prev) => ({
      ...prev,
      [groupId]: [...new Set(roleIds)].filter((n) => n > 0),
    }));
  };

  const getGroupUiState = (g: GroupTreeRow) => {
    const gid = normId(g.group_id);
    const roles = g.roles || [];
    const selected = new Set(selectionByGroup[gid] ?? []);
    const total = roles.length;
    if (total === 0) {
      return { checked: false, indeterminate: false, selectedCount: 0 };
    }
    let c = 0;
    roles.forEach((r) => {
      if (selected.has(toNumId(r.role_id))) c += 1;
    });
    if (c === 0) return { checked: false, indeterminate: false, selectedCount: 0 };
    if (c === total) return { checked: true, indeterminate: false, selectedCount: c };
    return { checked: false, indeterminate: true, selectedCount: c };
  };

  const onToggleGroup = (g: GroupTreeRow) => {
    const gid = normId(g.group_id);
    const roles = g.roles || [];
    const { checked, indeterminate } = getGroupUiState(g);
    const allIds = roles.map((r) => toNumId(r.role_id)).filter((n) => n > 0);
    if (checked) {
      setRolesForGroup(gid, []);
      return;
    }
    if (indeterminate || !checked) {
      setRolesForGroup(gid, allIds);
    }
  };

  const onToggleRole = (groupId: string, roleId: number, nextChecked: boolean) => {
    const cur = new Set(selectionByGroup[groupId] ?? []);
    if (nextChecked) cur.add(roleId);
    else cur.delete(roleId);
    setRolesForGroup(groupId, [...cur]);
  };

  const handleCancel = () => {
    setSelectionByGroup(JSON.parse(JSON.stringify(baseline)) as Record<string, number[]>);
    onClose?.();
  };

  const handleSave = async () => {
    if (!target?.user?.id) return;
    setIsSubmitting(true);
    try {
      const body = tree.map((g) => ({
        group_id: toNumId(g.group_id) || g.group_id,
        role_ids: selectionByGroup[normId(g.group_id)] ?? [],
      }));
      await api.put(adminEndpoints.users.rolesBatch(target.user.id), body);
      showSuccess("Đã đồng bộ vai trò theo nhóm");
      setBaseline(JSON.parse(JSON.stringify(selectionByGroup)) as Record<string, number[]>);
      onSuccess?.();
      onClose?.();
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } };
      const payload = e?.response?.data;
      showError(payload?.message || "Có lỗi khi lưu phân quyền");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !target) return null;

  return (
    <Modal
      show={show}
      onClose={onClose || (() => {})}
      title="Phân quyền người dùng"
      size="xl"
      loading={loadingTree || isSubmitting}
    >
      <div className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Phân quyền theo nhóm</h3>
            <p className="text-sm text-gray-500">
              Chọn nhóm (accordion), tick vai trò trong từng nhóm. Lưu gửi một lần qua API batch (thay thế toàn bộ role trong từng nhóm).
            </p>
          </div>
        </header>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <span className="font-medium text-gray-500">Họ tên:</span>{" "}
                <span className="text-gray-900 font-semibold">{target.user?.name || target.user?.username || "—"}</span>
              </span>
              <span>
                <span className="font-medium text-gray-500">Email:</span>{" "}
                <span className="text-gray-900">{target.user?.email || "—"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-[min(480px,58vh)] overflow-y-auto pr-1">
            {loadingTree && (
              <p className="text-sm text-gray-500 py-6 text-center">Đang tải nhóm và vai trò...</p>
            )}
            {!loadingTree && tree.length === 0 && (
              <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200 rounded-xl">
                Không có nhóm/vai trò nào để hiển thị trong ngữ cảnh hiện tại.
              </p>
            )}
            {!loadingTree &&
              tree.map((g) => {
                const gid = normId(g.group_id);
                const open = expanded[gid] !== false;
                const { checked: gChecked, indeterminate: gIndeterminate } = getGroupUiState(g);
                return (
                  <div key={gid} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50/80 transition-colors"
                      onClick={() => setExpanded((prev) => ({ ...prev, [gid]: !open }))}
                    >
                      <span
                        className="text-gray-400 shrink-0 w-5 flex justify-center"
                        aria-hidden
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <span
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <GroupCheckbox
                          checked={gChecked}
                          indeterminate={gIndeterminate}
                          onChange={() => onToggleGroup(g)}
                          ariaLabel={`Chọn tất cả vai trò — ${g.group_name || `Nhóm ${gid}`}`}
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900 block truncate">
                          {g.group_name || `Nhóm ${gid}`}
                        </span>
                        <span className="text-xs text-gray-500">ID nhóm: {gid}</span>
                      </span>
                    </button>
                    {open && (
                      <ul className="border-t border-gray-100 px-3 py-2 space-y-1.5 pl-12 bg-gray-50/40">
                        {(g.roles || []).map((r) => {
                          const rid = toNumId(r.role_id);
                          const sel = new Set(selectionByGroup[gid] ?? []);
                          const isOn = sel.has(rid);
                          return (
                            <li key={`${gid}-${rid}`} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`role-${gid}-${rid}`}
                                checked={isOn}
                                onChange={(e) => onToggleRole(gid, rid, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`role-${gid}-${rid}`}
                                className="text-sm text-gray-800 cursor-pointer select-none flex-1"
                              >
                                {r.role_name?.trim() || `Vai trò #${rid}`}
                              </label>
                            </li>
                          );
                        })}
                        {(g.roles || []).length === 0 && (
                          <li className="text-xs text-gray-500 py-1">Không có vai trò nào được phép gán trong nhóm này.</li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || loadingTree || !tree.length || !isDirty}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function GroupCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}
