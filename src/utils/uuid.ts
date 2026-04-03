/**
 * UUID utility functions for generating and validating UUIDs
 */

/**
 * Generate a UUID v4
 * @returns A new UUID v4 string
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validate if a string is a valid UUID v4
 * @param uuid The string to validate
 * @returns True if string is a valid UUID v4, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Get or create a cart UUID from sessionStorage
 * @returns A cart UUID from sessionStorage or a new one if none exists
 */
export function getOrCreateCartUuid(): string {
  if (typeof window === "undefined") {
    // If we're on the server side, generate a temporary UUID
    return generateUUID();
  }

  let cartUuid = sessionStorage.getItem("cart_uuid");

  if (!cartUuid || !isValidUUID(cartUuid)) {
    cartUuid = generateUUID();
    sessionStorage.setItem("cart_uuid", cartUuid);
  }

  return cartUuid;
}

/**
 * Set a cart UUID in sessionStorage
 * @param cartUuid The cart UUID to set
 */
export function setCartUuid(cartUuid: string): void {
  if (typeof window !== "undefined" && isValidUUID(cartUuid)) {
    sessionStorage.setItem("cart_uuid", cartUuid);
  }
}

/**
 * Clear cart UUID from sessionStorage
 */
export function clearCartUuid(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("cart_uuid");
  }
}

/**
 * Migrate from session_id to cart_uuid
 * This function should be called once during the migration process
 */
export function migrateFromSessionIdToUuid(): string {
  if (typeof window === "undefined") {
    return generateUUID();
  }

  // Check if we already have a cart_uuid in sessionStorage
  const existingCartUuid = sessionStorage.getItem("cart_uuid");
  if (existingCartUuid && isValidUUID(existingCartUuid)) {
    return existingCartUuid;
  }

  // Try to get old session_id
  const oldSessionId = sessionStorage.getItem("session_id");

  // Generate a new cart_uuid
  const newCartUuid = generateUUID();
  sessionStorage.setItem("cart_uuid", newCartUuid);

  // Clean up old session_id
  if (oldSessionId) {
    sessionStorage.removeItem("session_id");
  }

  // Also clean up any cart_owner_key that might have been stored in localStorage
  localStorage.removeItem("cart_owner_key");

  return newCartUuid;
}



