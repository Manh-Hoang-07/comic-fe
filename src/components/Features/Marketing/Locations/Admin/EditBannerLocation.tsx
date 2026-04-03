"use client";

import { useState, useEffect, useCallback } from "react";
import BannerLocationForm from "./BannerLocationForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface BannerLocation {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
}

interface EditBannerLocationProps {
  show: boolean;
  locationId: number;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditBannerLocation({
  show,
  locationId,
  statusEnums,
  apiErrors,
  onUpdated,
  onClose,
}: EditBannerLocationProps) {
  const [location, setLocation] = useState<BannerLocation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLocationData = useCallback(async () => {
    if (!locationId) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.bannerLocations.show(locationId));
      const data = response.data?.data || response.data;
      setLocation(data);
    } catch (err: any) {
      console.error("Error fetching location:", err);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    if (show && locationId) {
      fetchLocationData();
    }
  }, [show, locationId, fetchLocationData]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-700">Đang tải thông tin vị trí banner...</p>
        </div>
      </div>
    );
  }

  return (
    <BannerLocationForm
      show={show && !loading}
      location={location}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



