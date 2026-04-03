import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import type { AdminResponse } from "@/types/comic";
import type { AdminCountry, AdminProvince, AdminWard } from "@/types/location";

export interface LocationListParams {
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
  status?: string;
}

export interface ProvinceListParams extends LocationListParams {
  country_id?: number | string;
}

export interface WardListParams extends LocationListParams {
  province_id?: number | string;
}

export const adminLocationService = {
  getCountries: async (params: LocationListParams = {}): Promise<AdminResponse<AdminCountry[]>> => {
    const response = await api.get<AdminResponse<AdminCountry[]>>(adminEndpoints.location.countries.list, {
      params,
    });
    return response.data;
  },

  getProvinces: async (params: ProvinceListParams = {}): Promise<AdminResponse<AdminProvince[]>> => {
    const response = await api.get<AdminResponse<AdminProvince[]>>(adminEndpoints.location.provinces.list, {
      params,
    });
    return response.data;
  },

  getWards: async (params: WardListParams = {}): Promise<AdminResponse<AdminWard[]>> => {
    const response = await api.get<AdminResponse<AdminWard[]>>(adminEndpoints.location.wards.list, {
      params,
    });
    return response.data;
  },
};

