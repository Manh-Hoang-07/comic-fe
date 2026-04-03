"use client";

import { useState, useEffect, useCallback } from "react";
import RoleForm from "./RoleForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditRoleProps {
  show: boolean;
  role?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditRole({
  show,
  role,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditRoleProps) {
  const [showModal, setShowModal] = useState(false);
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoleDetails = useCallback(async () => {
    if (!role?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.roles.show(role.id));

      if (response.data?.success && response.data?.data) {
        setRoleData(response.data.data);
      } else if (response.data && !response.data.success) {
        setRoleData(response.data);
      } else {
        setRoleData(role || {});
      }
    } catch (error) {
      setRoleData(role || {});
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    setShowModal(show);
    if (show && role?.id) {
      setRoleData(role);
      fetchRoleDetails();
    } else {
      setRoleData(null);
      setLoading(false);
    }
  }, [show, role, fetchRoleDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <RoleForm
      show={showModal}
      role={roleData}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



