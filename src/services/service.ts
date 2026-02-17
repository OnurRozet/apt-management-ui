/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";

const BASE_URI: string = process.env.NEXT_PUBLIC_API_BASE_URI ?? "";
const API_KEY: string = process.env.NEXT_PUBLIC_API_API_KEY ?? "";

// Backend URL'ini logla (sadece server-side'da)
if (typeof window === "undefined") {
  console.log(`[SERVICE] Backend Base URI: ${BASE_URI}`);
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

function getHeaders(isAnonymous?: boolean, clientToken?: string) {
  const result: {
    "x-api-key": string;
    Authorization: string | undefined;
  } = {
    "x-api-key": API_KEY,
    Authorization: undefined,
  };
  if (!isAnonymous && clientToken) {
    result.Authorization = "Bearer ".concat(clientToken);
  }
  return result;
}

export async function Get<T>(
  endpointUri: string,
  requestData?: any,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[GET] İstek gönderiliyor: ${fullUrl}`, { params: requestData });
  
  try {
    const response = await axios.get<T>(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: requestData ? { ...requestData } : undefined,
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[GET] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[GET] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}
export async function Put<T>(
  endpointUri: string,
  requestData?: any,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[PUT] İstek gönderiliyor: ${fullUrl}`, { data: requestData });
  
  try {
    const response = await axios.put<T>(fullUrl, requestData, {
      headers: getHeaders(isAnonymous, clientToken),
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[PUT] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[PUT] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}
export async function Post<T>(
  endpointUri: string,
  requestData?: any,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[POST] İstek gönderiliyor: ${fullUrl}`, { data: requestData });
  
  try {
    const response = await axios(BASE_URI + `${endpointUri}`, {
      method: "POST",
      data: requestData,
      headers: getHeaders(isAnonymous, clientToken),
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[POST] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[POST] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}

export async function PostFile<T>(
  endpointUri: string,
  file: File,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[POST FILE] İstek gönderiliyor: ${fullUrl}`, { fileName: file.name, fileSize: file.size });
  
  const formData = new FormData();
  formData.append("file", file);

  const baseHeaders = getHeaders(isAnonymous, clientToken);

  try {
    const response = await axios.post<T>(fullUrl, formData, {
      headers: {
        ...baseHeaders,
        "Content-Type": "multipart/form-data",
      },
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[POST FILE] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[POST FILE] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}
export async function Delete<T>(
  endpointUri: string,
  requestData?: any,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[DELETE] İstek gönderiliyor: ${fullUrl}`, { params: requestData });
  
  try {
    const response = await axios.delete<T>(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: { ...requestData },
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[DELETE] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[DELETE] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}

export async function GetBlob(
  endpointUri: string,
  requestData?: any,
  isAnonymous?: boolean,
  clientToken?: string,
) {
  const fullUrl = BASE_URI + `${endpointUri}`;
  console.log(`[GET BLOB] İstek gönderiliyor: ${fullUrl}`, { params: requestData });
  
  try {
    const response = await axios.get(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: requestData ? { ...requestData } : undefined,
      responseType: "blob",
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    console.log(`[GET BLOB] Başarılı: ${fullUrl}`, { status: response.status });
    return response;
  } catch (error: any) {
    console.error(`[GET BLOB] Hata: ${fullUrl}`, { 
      status: error.response?.status, 
      message: error.message,
      data: error.response?.data 
    });
    throw error;
  }
}
