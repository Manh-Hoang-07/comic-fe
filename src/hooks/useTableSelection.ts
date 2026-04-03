"use client";

import { useState, useMemo, useCallback } from "react";

export interface TableSelectionOptions<T = any> {
  keyField?: string;
  multiSelect?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
}

export interface TableSelectionResult<T = any> {
  selectedItems: T[];
  selectedKeys: Set<string | number>;
  hasSelection: boolean;
  selectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  selectItem: (item: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (item: T) => boolean;
  getSelectedKeys: () => (string | number)[];
  selectByKeys: (keys: (string | number)[]) => void;
  removeFromSelection: (item: T) => void;
}

function getItemKey<T>(item: T, keyField: string): string | number {
  return (item as any)[keyField];
}

function isItemSelected<T>(
  item: T,
  selectedKeys: Set<string | number>,
  keyField: string
): boolean {
  const key = getItemKey(item, keyField);
  return selectedKeys.has(key);
}

function toggleItemSelection<T>(
  item: T,
  selectedItems: T[],
  selectedKeys: Set<string | number>,
  keyField: string,
  multiSelect: boolean
): { selectedItems: T[]; selectedKeys: Set<string | number> } {
  const key = getItemKey(item, keyField);

  if (!multiSelect) {
    // Single select mode
    return {
      selectedItems: [item],
      selectedKeys: new Set([key]),
    };
  }

  // Multi select mode
  if (selectedKeys.has(key)) {
    // Deselect
    return {
      selectedItems: selectedItems.filter(
        (i) => getItemKey(i, keyField) !== key
      ),
      selectedKeys: new Set([...selectedKeys].filter((k) => k !== key)),
    };
  } else {
    // Select
    return {
      selectedItems: [...selectedItems, item],
      selectedKeys: new Set([...selectedKeys, key]),
    };
  }
}

function selectAllItems<T>(
  items: T[],
  selectedItems: T[],
  selectedKeys: Set<string | number>,
  keyField: string
): { selectedItems: T[]; selectedKeys: Set<string | number> } {
  const allKeys = new Set(items.map((item) => getItemKey(item, keyField)));
  const isAllSelected = selectedItems.length === items.length;

  if (isAllSelected) {
    // Deselect all
    return {
      selectedItems: [],
      selectedKeys: new Set(),
    };
  } else {
    // Select all
    return {
      selectedItems: [...items],
      selectedKeys: allKeys,
    };
  }
}

export default function useTableSelection<T = any>(
  items: T[] = [],
  options: TableSelectionOptions<T> = {}
): TableSelectionResult<T> {
  const {
    keyField = "id",
    multiSelect = true,
    onSelectionChange,
  } = options;

  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
    new Set()
  );

  const hasSelection = useMemo(
    () => selectedItems.length > 0,
    [selectedItems.length]
  );

  const selectedCount = useMemo(
    () => selectedItems.length,
    [selectedItems.length]
  );

  const isAllSelected = useMemo(() => {
    if (!items || items.length === 0) return false;
    return selectedItems.length === items.length;
  }, [items, selectedItems.length]);

  const isIndeterminate = useMemo(() => {
    return selectedItems.length > 0 && selectedItems.length < items.length;
  }, [selectedItems.length, items.length]);

  const selectItem = useCallback(
    (item: T) => {
      const result = toggleItemSelection(
        item,
        selectedItems,
        selectedKeys,
        keyField,
        multiSelect
      );

      setSelectedItems(result.selectedItems);
      setSelectedKeys(result.selectedKeys);

      // Trigger callback
      if (onSelectionChange) {
        onSelectionChange(result.selectedItems);
      }
    },
    [selectedItems, selectedKeys, keyField, multiSelect, onSelectionChange]
  );

  const selectAll = useCallback(() => {
    const result = selectAllItems(items, selectedItems, selectedKeys, keyField);

    setSelectedItems(result.selectedItems);
    setSelectedKeys(result.selectedKeys);

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange(result.selectedItems);
    }
  }, [items, selectedItems, selectedKeys, keyField, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectedKeys(new Set());

    // Trigger callback
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  const isSelected = useCallback(
    (item: T): boolean => {
      return isItemSelected(item, selectedKeys, keyField);
    },
    [selectedKeys, keyField]
  );

  const getSelectedKeys = useCallback((): (string | number)[] => {
    return Array.from(selectedKeys);
  }, [selectedKeys]);

  const selectByKeys = useCallback(
    (keys: (string | number)[]) => {
      const itemsToSelect = items.filter((item) =>
        keys.includes(getItemKey(item, keyField))
      );
      setSelectedItems(itemsToSelect);
      setSelectedKeys(new Set(keys));

      // Trigger callback
      if (onSelectionChange) {
        onSelectionChange(itemsToSelect);
      }
    },
    [items, keyField, onSelectionChange]
  );

  const removeFromSelection = useCallback(
    (item: T) => {
      const key = getItemKey(item, keyField);
      setSelectedItems((prev) =>
        prev.filter((i) => getItemKey(i, keyField) !== key)
      );
      setSelectedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });

      // Trigger callback
      if (onSelectionChange) {
        setSelectedItems((prev) => {
          const filtered = prev.filter((i) => getItemKey(i, keyField) !== key);
          onSelectionChange(filtered);
          return filtered;
        });
      }
    },
    [keyField, onSelectionChange]
  );

  return {
    selectedItems,
    selectedKeys,
    hasSelection,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    selectItem,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedKeys,
    selectByKeys,
    removeFromSelection,
  };
}



