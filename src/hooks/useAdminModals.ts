"use client";

import { useState, useCallback } from "react";

export interface AdminModals {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view?: boolean;
  [key: string]: boolean | undefined;
}

export interface AdminModalsResult {
  modals: AdminModals;
  selectedItem: any;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (item: any) => void;
  closeEditModal: () => void;
  openDeleteModal: (item: any) => void;
  closeDeleteModal: () => void;
  openViewModal: (item: any) => void;
  closeViewModal: () => void;
  openModal: (modalName: string, item?: any) => void;
  closeModal: (modalName: string) => void;
  closeAllModals: () => void;
  resetSelectedItem: () => void;
}

export interface AdminModalsOptions {
  onOpen?: (modalName: string, item?: any) => void;
  onClose?: (modalName: string) => void;
  clearApiErrors?: () => void;
  customModals?: string[];
  includeViewModal?: boolean;
}

/**
 * Hook để quản lý các modal trong trang admin CRUD
 */
export function useAdminModals(
  options: AdminModalsOptions = {}
): AdminModalsResult {
  const {
    onOpen,
    onClose,
    clearApiErrors,
    customModals = [],
    includeViewModal = false,
  } = options;

  // Initialize modals state
  const initialModals: AdminModals = {
    create: false,
    edit: false,
    delete: false,
  };

  // Add view modal if needed
  if (includeViewModal) {
    initialModals.view = false;
  }

  // Add custom modals
  customModals.forEach((modalName) => {
    initialModals[modalName] = false;
  });

  const [modals, setModals] = useState<AdminModals>(initialModals);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Helper function to handle modal opening
  const handleModalOpen = useCallback(
    (modalName: string, item?: any) => {
      setModals((prev) => ({
        ...prev,
        [modalName]: true,
      }));
      if (item !== undefined) {
        setSelectedItem(item);
      }
      if (clearApiErrors) {
        clearApiErrors();
      }
      if (onOpen) {
        onOpen(modalName, item);
      }
    },
    [clearApiErrors, onOpen]
  );

  // Helper function to handle modal closing
  const handleModalClose = useCallback(
    (modalName: string, clearItem: boolean = true) => {
      setModals((prev) => ({
        ...prev,
        [modalName]: false,
      }));
      if (clearItem) {
        setSelectedItem(null);
      }
      if (clearApiErrors) {
        clearApiErrors();
      }
      if (onClose) {
        onClose(modalName);
      }
    },
    [clearApiErrors, onClose]
  );

  // Create modal handlers
  const openCreateModal = useCallback(() => {
    handleModalOpen("create");
  }, [handleModalOpen]);

  const closeCreateModal = useCallback(() => {
    handleModalClose("create", false); // Don't clear item for create
  }, [handleModalClose]);

  // Edit modal handlers
  const openEditModal = useCallback(
    (item: any) => {
      handleModalOpen("edit", item);
    },
    [handleModalOpen]
  );

  const closeEditModal = useCallback(() => {
    handleModalClose("edit");
  }, [handleModalClose]);

  // Delete modal handlers
  const openDeleteModal = useCallback(
    (item: any) => {
      handleModalOpen("delete", item);
    },
    [handleModalOpen]
  );

  const closeDeleteModal = useCallback(() => {
    handleModalClose("delete");
  }, [handleModalClose]);

  // View modal handlers
  const openViewModal = useCallback(
    (item: any) => {
      handleModalOpen("view", item);
    },
    [handleModalOpen]
  );

  const closeViewModal = useCallback(() => {
    handleModalClose("view");
  }, [handleModalClose]);

  // Generic modal handlers
  const openModal = useCallback(
    (modalName: string, item?: any) => {
      handleModalOpen(modalName, item);
    },
    [handleModalOpen]
  );

  const closeModal = useCallback(
    (modalName: string) => {
      handleModalClose(modalName);
    },
    [handleModalClose]
  );

  // Utility functions
  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      const newModals: AdminModals = { ...prev };
      Object.keys(newModals).forEach((key) => {
        newModals[key] = false;
      });
      return newModals;
    });
    setSelectedItem(null);
    if (clearApiErrors) {
      clearApiErrors();
    }
  }, [clearApiErrors]);

  const resetSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    modals,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    openModal,
    closeModal,
    closeAllModals,
    resetSelectedItem,
  };
}



