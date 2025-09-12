import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 检查是否启用了站点访问控制
  if (process.env.NEXT_PUBLIC_SITE_ACCESS_ENABLED === 'true') {
    // 排除访问密钥页面、API路由、静态文件、管理员路由和认证路由
    const pathname = request.nextUrl.pathname;
    const isAccessKeyPage = pathname.includes('/access-key');
    const isApiRoute = pathname.startsWith('/api');
    const isStaticFile = pathname.includes('.');
    const isNextInternal = pathname.startsWith('/_next') || pathname.startsWith('/_vercel');
    const isAdminRoute = pathname.includes('/admin');
    const isAuthRoute = pathname.includes('/auth');
    
    if (!isAccessKeyPage && !isApiRoute && !isStaticFile && !isNextInternal && !isAdminRoute && !isAuthRoute) {
      // 检查访问令牌cookie
      const accessToken = request.cookies.get('site_access_token');
      
      if (!accessToken) {
        // 没有访问令牌，重定向到访问密钥页面
        const url = request.nextUrl.clone();
        
        // 获取当前语言
        let locale = 'en';
        const pathSegments = pathname.split('/').filter(Boolean);
        const supportedLocales = ['en', 'en-US', 'zh', 'zh-CN', 'zh-TW', 'zh-HK', 'zh-MO', 'ja', 'ko', 'ru', 'fr', 'de', 'ar', 'es', 'it'];
        
        if (pathSegments.length > 0 && supportedLocales.includes(pathSegments[0])) {
          locale = pathSegments[0];
        }
        
        url.pathname = `/${locale}/access-key`;
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
  }
  
  // 继续执行国际化中间件
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)/:path*",
    "/((?!privacy-policy|terms-of-service|api/|_next|_vercel|.*\\..*).*)",
  ],
};
