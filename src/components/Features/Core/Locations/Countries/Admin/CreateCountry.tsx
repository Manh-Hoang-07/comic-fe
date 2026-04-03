"use client";

import CountryForm, { CountryFormValues } from "./CountryForm";

interface CreateCountryProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: CountryFormValues) => void;
}

export default function CreateCountry({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreateCountryProps) {
  return (
    <CountryForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}

