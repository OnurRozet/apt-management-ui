import { Apartment, ApartmentSearch, CreateOrEditResponse, DetailResponse, SearchResponse, ServiceResult } from "@/types";
import { Delete, Get, Post, PostFile } from "./service";

export const ApartmentService = {
  createOrEditApartment: async (
    apartmentData: Apartment,
    isAnonymous = false,
    clientToken?: string
  ) => {
    return Post<ServiceResult<CreateOrEditResponse>>(
      "/apartment",
      apartmentData,
      isAnonymous,
      clientToken
    );
  },
  searchApartments: async (
    searchParams: ApartmentSearch,
    isAnonymous = false,
    clientToken?: string
  ) => {
    return Get<ServiceResult<SearchResponse<Apartment>>>(
      "/apartment/search",
      searchParams,
      isAnonymous,
      clientToken
    );
  },
  getApartmentById: async (
    apartmentId: number,
    isAnonymous = false,
    clientToken?: string
  ) => {
    return Get<ServiceResult<DetailResponse<Apartment>>>(
      `/apartment/${apartmentId}`,
      undefined,
      isAnonymous,
      clientToken
    );
  },
  deleteApartment: async (
    apartmentId: number,
    isAnonymous = false,
    clientToken?: string
  ) => {
    return Delete<ServiceResult<boolean>>(
      `/apartment/${apartmentId}`,
      undefined,
      isAnonymous,
      clientToken
    );
  },
  uploadExcel: async (file: File) => {
    return PostFile<ServiceResult<Apartment>>("/apartment/excel-create", file);
  },
};