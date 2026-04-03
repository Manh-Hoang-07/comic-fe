"use client";

import { useState, useCallback, useEffect } from "react";

export interface ModalOptions {
  initialState?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
  onOpen?: (data: any) => void;
  onClose?: (data: any) => void;
  beforeClose?: (data: any) => Promise<boolean> | boolean;
}

export interface ModalResult {
  isOpen: boolean;
  isLoading: boolean;
  data: any;
  isClosed: boolean;
  open: (modalData?: any) => void;
  close: () => Promise<boolean>;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  setData: (newData: any) => void;
  reset: () => void;
  handleOverlayClick: (event: React.MouseEvent) => void;
}

function shouldCloseModal(
  event: KeyboardEvent | React.MouseEvent,
  options: ModalOptions
): boolean {
  if (event instanceof KeyboardEvent) {
    return (options.closeOnEscape ?? true) && event.key === "Escape";
  }

  if (event instanceof MouseEvent || "target" in event) {
    return (
      (options.closeOnOverlay ?? true) &&
      event.target === event.currentTarget
    );
  }

  return false;
}

export default function useModal(options: ModalOptions = {}): ModalResult {
  const {
    initialState = false,
    closeOnEscape = true,
    closeOnOverlay = true,
    onOpen,
    onClose,
    beforeClose,
  } = options;

  const [isOpen, setIsOpen] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setDataState] = useState<any>(null);

  const open = useCallback(
    (modalData: any = null) => {
      if (modalData !== null) {
        setDataState(modalData);
      }
      setIsOpen(true);

      if (onOpen) {
        onOpen(data);
      }
    },
    [onOpen, data]
  );

  const close = useCallback(async (): Promise<boolean> => {
    // Check beforeClose callback
    if (beforeClose) {
      const shouldClose = await beforeClose(data);
      if (shouldClose === false) {
        return false;
      }
    }

    setIsOpen(false);

    if (onClose) {
      onClose(data);
    }

    // Clear data after closing
    setTimeout(() => {
      setDataState(null);
    }, 300); // Wait for animation

    return true;
  }, [beforeClose, onClose, data]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setData = useCallback((newData: any) => {
    setDataState(newData);
  }, []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    setDataState(null);
  }, []);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (shouldCloseModal(event, options) && isOpen) {
        close();
      }
    },
    [isOpen, close, options]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (shouldCloseModal(event, options)) {
        close();
      }
    },
    [close, options]
  );

  // Watch for open state changes
  useEffect(() => {
    if (isOpen) {
      // Add event listeners when modal opens
      if (closeOnEscape) {
        document.addEventListener("keydown", handleKeydown);
      }
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Remove event listeners when modal closes
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleKeydown);
      }
      // Restore body scroll
      document.body.style.overflow = "";
    }

    return () => {
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleKeydown);
      }
      document.body.style.overflow = "";
    };
  }, [isOpen, closeOnEscape, handleKeydown]);

  return {
    isOpen,
    isLoading,
    data,
    isClosed: !isOpen,
    open,
    close,
    toggle,
    setLoading,
    setData,
    reset,
    handleOverlayClick,
  };
}



