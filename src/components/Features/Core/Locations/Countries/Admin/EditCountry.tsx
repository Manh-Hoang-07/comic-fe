"use client";

import CountryForm, {
  AdminCountryFormEntity,
  CountryFormValues,
} from "./CountryForm";

interface EditCountryProps {
  show: boolean;
  country: AdminCountryFormEntity;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: CountryFormValues) => void;
}

export default function EditCountry({
  show,
  country,
  apiErrors,
  onClose,
  onUpdated,
}: EditCountryProps) {
  return (
    <CountryForm
      show={show}
      country={country}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}

