"use client";

import { useState, useCallback, useEffect } from "react";

export interface ModalOptions {
  initialState?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
  onOpen?: (data: unknown) => void;
  onClose?: (data: unknown) => void;
  beforeClose?: (data: unknown) => Promise<boolean> | boolean;
}

export interface ModalResult<T = unknown> {
  isOpen: boolean;
  isLoading: boolean;
  data: T | null;
  isClosed: boolean;
  open: (modalData?: T) => void;
  close: () => Promise<boolean>;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  setData: (newData: T | null) => void;
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

  if (
    event instanceof MouseEvent ||
    (typeof event === "object" && event !== null && "target" in event)
  ) {
    return (
      (options.closeOnOverlay ?? true) && event.target === event.currentTarget
    );
  }

  return false;
}

export default function useModal<T = unknown>(
  options: ModalOptions = {}
): ModalResult<T> {
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
  const [data, setDataState] = useState<T | null>(null);

  const open = useCallback(
    (modalData: T | null = null) => {
      if (modalData !== null) {
        setDataState(modalData);
      }
      setIsOpen(true);

      if (onOpen) {
        onOpen(modalData);
      }
    },
    [onOpen]
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

  const setData = useCallback((newData: T | null) => {
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



