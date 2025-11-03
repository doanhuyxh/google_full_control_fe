import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách route yêu cầu đăng nhập
const protectedRoutes = ["/dashboard", "/accounts", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Nếu không nằm trong danh sách cần bảo vệ → cho phép
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Lấy token từ cookie (ví dụ cookie tên là "token")
  const token = req.cookies.get("token")?.value;

  // Nếu chưa đăng nhập → chuyển hướng về trang login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    // Nếu muốn redirect xong quay lại trang cũ:
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu có token → cho phép truy cập
  return NextResponse.next();
}

// Áp dụng middleware cho tất cả request
export const config = {
  matcher: [
    // chỉ cần lọc những route cần check
    "/dashboard/:path*",
    "/accounts/:path*",
    "/settings/:path*",
  ],
};
