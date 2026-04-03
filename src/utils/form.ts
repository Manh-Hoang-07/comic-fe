import apiClient from "@/lib/api/client";

// ===== TYPES =====

interface FormDataOptions {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  skipEmpty?: boolean;
  exclude?: string[];
}

interface FormObject {
  [key: string]: any;
}

interface ApiFormSubmitOptions {
  endpoint: string;
  emit: (event: string, ...args: any[]) => void;
  onClose?: () => void;
  eventName?: string;
  method?: "post" | "put" | "patch" | "delete";
}

interface ApiErrors {
  [field: string]: string;
}

// ===== FORM TO FORMDATA =====

/**
 * Convert form object to FormData with type safety
 */
export function formToFormData(
  form: FormObject,
  options: FormDataOptions = {}
): FormData {
  const submitData = new FormData();

  // Nếu là update (PUT/PATCH), thêm _method vào FormData
  if (
    options.method &&
    (options.method.toLowerCase() === "put" ||
      options.method.toLowerCase() === "patch")
  ) {
    submitData.append("_method", options.method.toUpperCase());
  }

  const appendValue = (fd: FormData, key: string, value: any): void => {
    // Nếu là boolean true cho remove_xxx, append 1
    if (typeof key === "string" && key.startsWith("remove_") && value) {
      fd.append(key, "1");
      return;
    }

    if (value === null || value === undefined) {
      fd.append(key, "");
      return;
    }

    if (value === "" && options.skipEmpty) return;

    // File/Blob giữ nguyên
    if (typeof File !== "undefined" && value instanceof File) {
      fd.append(key, value);
      return;
    }

    if (typeof Blob !== "undefined" && value instanceof Blob) {
      fd.append(key, value);
      return;
    }

    // Array -> key[]
    if (Array.isArray(value)) {
      value.forEach((item) => {
        fd.append(`${key}[]`, item);
      });
      return;
    }

    // Object -> key[sub]
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        appendValue(fd, `${key}[${subKey}]`, value[subKey]);
      });
      return;
    }

    // Primitive
    fd.append(key, String(value));
  };

  Object.keys(form).forEach((key) => {
    if (options.exclude && options.exclude.includes(key)) return;
    appendValue(submitData, key, form[key]);
  });

  return submitData;
}

// ===== API FORM SUBMIT =====

/**
 * API form submit with error handling and type safety
 */
export function useApiFormSubmit({
  endpoint,
  emit,
  onClose,
  eventName = "created",
  method = "post",
}: ApiFormSubmitOptions) {
  const apiErrors: ApiErrors = {};

  async function submit(form: FormObject) {
    try {
      // Xóa lỗi cũ
      Object.keys(apiErrors).forEach((key) => delete apiErrors[key]);

      // Luôn tạo mới FormData và append _method nếu là update
      const dataToSend =
        method === "put" || method === "patch"
          ? formToFormData(form, {
              method: method.toUpperCase() as "PUT" | "PATCH",
            })
          : formToFormData(form);

      // Sử dụng method tương ứng thay vì luôn dùng post
      let response;
      switch (method) {
        case "put":
          response = await apiClient.put(endpoint, dataToSend);
          break;
        case "patch":
          response = await apiClient.patch(endpoint, dataToSend);
          break;
        case "delete":
          response = await apiClient.delete(endpoint, { data: dataToSend });
          break;
        default:
          response = await apiClient.post(endpoint, dataToSend);
      }
      emit(eventName);
      if (onClose) onClose();
      return response;
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        for (const field in errors) {
          apiErrors[field] = Array.isArray(errors[field])
            ? errors[field][0]
            : errors[field];
        }
      }
      throw error;
    }
  }

  return { apiErrors, submit };
}

// Default export for backward compatibility
export default formToFormData;



