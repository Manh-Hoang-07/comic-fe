"use client";

import { Controller, Control, FieldValues, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints, publicEndpoints } from "@/lib/api/endpoints";

interface LocationSelectorProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    countryFieldName?: string;
    provinceFieldName?: string;
    wardFieldName?: string;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    isAdmin?: boolean;
    required?: boolean;
}

/**
 * Reusable Location Selector component using Location DB
 * Supports dependent selects: Country -> Province -> Ward
 */
export default function LocationSelector({
    control,
    errors,
    countryFieldName = "country_id",
    provinceFieldName = "province_id",
    wardFieldName = "ward_id",
    watch,
    setValue,
    isAdmin = false,
    required = false,
}: LocationSelectorProps) {
    const endpoints = isAdmin ? adminEndpoints : publicEndpoints;

    const countryId = watch(countryFieldName);
    const provinceId = watch(provinceFieldName);

    const handleCountryChange = (_val: unknown) => {
        setValue(provinceFieldName, null);
        setValue(wardFieldName, null);
    };

    const handleProvinceChange = (_val: unknown) => {
        setValue(wardFieldName, null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
                name={countryFieldName}
                control={control}
                render={({ field }) => (
                    <SingleSelectEnhanced
                        {...field}
                        label="Quốc gia"
                        searchApi={`${isAdmin ? adminEndpoints.location.countries.simple : publicEndpoints.location.countries}?limit=1000`}
                        labelField="name"
                        valueField="id"
                        placeholder="Chọn quốc gia"
                        error={errors[countryFieldName]?.message as string | undefined}
                        required={required}
                        onChange={(val) => {
                            field.onChange(val);
                            handleCountryChange(val);
                        }}
                    />
                )}
            />

            <Controller
                name={provinceFieldName}
                control={control}
                render={({ field }) => (
                    <SingleSelectEnhanced
                        {...field}
                        label="Tỉnh / Thành phố"
                        searchApi={
                            countryId
                                ? `${isAdmin ? adminEndpoints.location.provinces.simple : publicEndpoints.location.provinces}?filter[country_id]=${countryId}&limit=1000`
                                : undefined
                        }
                        labelField="name"
                        valueField="id"
                        placeholder={countryId ? "Chọn tỉnh / thành phố" : "Vui lòng chọn quốc gia trước"}
                        error={errors[provinceFieldName]?.message as string | undefined}
                        required={required}
                        disabled={!countryId}
                        onChange={(val) => {
                            field.onChange(val);
                            handleProvinceChange(val);
                        }}
                    />
                )}
            />

            <Controller
                name={wardFieldName}
                control={control}
                render={({ field }) => (
                    <SingleSelectEnhanced
                        {...field}
                        label="Phường / Xã"
                        searchApi={
                            provinceId
                                ? `${isAdmin ? adminEndpoints.location.wards.simple : publicEndpoints.location.wards}?filter[province_id]=${provinceId}&limit=1000`
                                : undefined
                        }
                        labelField="name"
                        valueField="id"
                        placeholder={provinceId ? "Chọn phường / xã" : "Vui lòng chọn tỉnh / thành phố trước"}
                        error={errors[wardFieldName]?.message as string | undefined}
                        required={required}
                        disabled={!provinceId}
                    />
                )}
            />
        </div>
    );
}

