"use client";

import { useState, useEffect, useCallback } from "react";
import MenuForm from "./MenuForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditMenuProps {
  show: boolean;
  menu?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<any>;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditMenu({
  show,
  menu,
  statusEnums,
  parentMenus,
  permissions,
  apiErrors,
  onUpdated,
  onClose,
}: EditMenuProps) {
  const [showModal, setShowModal] = useState(false);
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMenuDetails = useCallback(async () => {
    if (!menu?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.menus.show(menu.id));
      if (response.data?.success) {
        setMenuData(response.data.data);
      } else {
        setMenuData(response.data.data || response.data);
      }
    } catch (error) {
      setMenuData(menu);
    } finally {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    setShowModal(show);
    if (show && menu?.id) {
      setMenuData(menu);
      fetchMenuDetails();
    } else {
      setMenuData(null);
      setLoading(false);
    }
  }, [show, menu, fetchMenuDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <MenuForm
      show={showModal}
      menu={menuData}
      statusEnums={statusEnums}
      parentMenus={parentMenus}
      permissions={permissions}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}



