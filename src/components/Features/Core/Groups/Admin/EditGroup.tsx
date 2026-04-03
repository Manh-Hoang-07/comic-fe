"use client";

import { useState, useEffect } from "react";
import GroupForm from "./GroupForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditGroupProps {
  show: boolean;
  group?: any;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditGroup({
  show,
  group,
  apiErrors,
  onUpdated,
  onClose,
}: EditGroupProps) {
  const [showModal, setShowModal] = useState(false);
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowModal(show);
    if (show && group?.id) {
      setGroupData(group);
    } else {
      setGroupData(null);
      setLoading(false);
    }
  }, [show, group]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <GroupForm
      show={showModal}
      group={groupData}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



