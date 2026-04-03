"use client";

import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";

interface SystemLocationSelectorProps {
    value: any;
    onChange: (value: any) => void;
    formData: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
}

export default function SystemLocationSelector({
    value,
    onChange,
    formData,
    onUpdate,
}: SystemLocationSelectorProps) {
    const countryId = formData.site_country_id;
    const provinceId = formData.site_province_id;
    const wardId = formData.site_ward_id;

    const handleCountryChange = (val: any) => {
        onUpdate("site_country_id", val);
        onUpdate("site_province_id", null);
        onUpdate("site_ward_id", null);
    };

    const handleProvinceChange = (val: any) => {
        onUpdate("site_province_id", val);
        onUpdate("site_ward_id", null);
    };

    const handleWardChange = (val: any) => {
        onUpdate("site_ward_id", val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quốc gia</label>
                <SingleSelectEnhanced
                    value={countryId}
                    searchApi={`${adminEndpoints.location.countries.simple}?limit=1000`}
                    labelField="name"
                    valueField="id"
                    placeholder="Chọn quốc gia"
                    onChange={handleCountryChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tỉnh / Thành phố</label>
                <SingleSelectEnhanced
                    value={provinceId}
                    searchApi={
                        countryId
                            ? `${adminEndpoints.location.provinces.simple}?filter[country_id]=${countryId}&limit=1000`
                            : undefined
                    }
                    labelField="name"
                    valueField="id"
                    placeholder={countryId ? "Chọn tỉnh / thành phố" : "Vui lòng chọn quốc gia trước"}
                    disabled={!countryId}
                    onChange={handleProvinceChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phường / Xã</label>
                <SingleSelectEnhanced
                    value={wardId}
                    searchApi={
                        provinceId
                            ? `${adminEndpoints.location.wards.simple}?filter[province_id]=${provinceId}&limit=1000`
                            : undefined
                    }
                    labelField="name"
                    valueField="id"
                    placeholder={provinceId ? "Chọn phường / xã" : "Vui lòng chọn tỉnh trước"}
                    disabled={!provinceId}
                    onChange={handleWardChange}
                />
            </div>
        </div>
    );
}
