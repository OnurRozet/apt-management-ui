/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";

const BASE_URI: string = process.env.NEXT_PUBLIC_API_BASE_URI ?? "";
const API_KEY: string = process.env.NEXT_PUBLIC_API_API_KEY ?? "";


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
  
  try {
    const response = await axios.get<T>(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: requestData ? { ...requestData } : undefined,
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    return response;
  } catch (error: any) {
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
  
  try {
    const response = await axios.put<T>(fullUrl, requestData, {
      headers: getHeaders(isAnonymous, clientToken),
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
        return response;
  } catch (error: any) {
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
  
  try {
    const response = await axios(BASE_URI + `${endpointUri}`, {
      method: "POST",
      data: requestData,
      headers: getHeaders(isAnonymous, clientToken),
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    return response;
  } catch (error: any) {
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
    return response;
  } catch (error: any) {
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
  
  try {
    const response = await axios.delete<T>(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: { ...requestData },
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    return response;
  } catch (error: any) {
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
  
  try {
    const response = await axios.get(fullUrl, {
      headers: getHeaders(isAnonymous, clientToken),
      params: requestData ? { ...requestData } : undefined,
      responseType: "blob",
      httpsAgent: typeof window === "undefined" ? httpsAgent : undefined,
    });
    return response;
  } catch (error: any) {
    throw error;
  }
}
