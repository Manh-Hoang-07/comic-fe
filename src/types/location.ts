export interface AdminCountry {
  id: number;
  code: string;
  code_alpha3?: string;
  name: string;
  official_name?: string;
  phone_code?: string;
  currency_code?: string;
  flag_emoji?: string;
  status?: string;
  created_user_id?: number | null;
  updated_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AdminProvince {
  id: number;
  code: string;
  name: string;
  type?: string;
  phone_code?: string;
  country_id: number;
  status?: string;
  note?: string | null;
  code_bnv?: string | null;
  code_tms?: string | null;
  created_user_id?: number | null;
  updated_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AdminWard {
  id: number;
  province_id: number;
  name: string;
  type?: string;
  code: string;
  status?: string;
  created_user_id?: number | null;
  updated_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

