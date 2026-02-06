import { AuthService } from "@/services/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const apartmentNumber = cookieStore.get("apartment_number")?.value;

    if (!token || !apartmentNumber) {
      return NextResponse.json(
        { user: null, message: "Oturum bulunamadı" },
        { status: 401 },
      );
    }

    const response = await AuthService.getMe(apartmentNumber, false, token);

    if (response.status !== 200 || !response.data?.isSuccess) {
      return NextResponse.json(
        { user: null, message: "Kullanıcı bilgileri alınamadı" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: response.data.resultObject,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { user: null, message: "Bir hata oluştu" },
      { status: 500 },
    );
  }
}
