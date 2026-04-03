"use client";

import { useState, useEffect, useCallback } from "react";
import BannerForm from "./BannerForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditBannerProps {
  show: boolean;
  bannerId?: number;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditBanner({
  show,
  bannerId,
  statusEnums,
  locationEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadBanner = useCallback(async () => {
    if (!bannerId) return;
    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.banners.show(bannerId));
      const data = response.data?.data || response.data;
      setBanner(data);
    } catch (error) {
      console.error("Error loading banner:", error);
    } finally {
      setLoading(false);
    }
  }, [bannerId]);

  useEffect(() => {
    setShowModal(show);
    if (show && bannerId) {
      loadBanner();
    }
  }, [show, bannerId, loadBanner]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <BannerForm
      show={showModal}
      banner={banner}
      statusEnums={statusEnums}
      locationEnums={locationEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



