import { eq, and, gt, or, isNull } from 'drizzle-orm';
import { siteAccessKeys } from '@/db/schema';
import { db } from '@/db';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface SiteAccessKey {
  id: number;
  access_key: string;
  title: string | null;
  status: string;
  created_by: string | null;
  expires_at: Date | null;
  created_at: Date | null;
  used_count: number;
}

// Cookie配置
const ACCESS_TOKEN_COOKIE = 'site_access_token';
const ACCESS_TOKEN_EXPIRES_DAYS = 30;

// 生成随机访问密钥
export function generateAccessKey(): string {
  return 'sk-' + crypto.randomBytes(32).toString('hex');
}

// 生成访问令牌（存储在cookie中）
export function generateAccessToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

// 验证访问密钥
export async function validateAccessKey(key: string): Promise<boolean> {
  try {
    const database = db();
    const result = await database
      .select()
      .from(siteAccessKeys)
      .where(
        and(
          eq(siteAccessKeys.access_key, key),
          eq(siteAccessKeys.status, 'active'),
          // 检查是否过期 - 如果expires_at为null则不过期
          or(
            isNull(siteAccessKeys.expires_at),
            gt(siteAccessKeys.expires_at, new Date())
          )
        )
      )
      .limit(1);

    if (result.length > 0) {
      // 增加使用次数
      await database
        .update(siteAccessKeys)
        .set({ used_count: result[0].used_count + 1 })
        .where(eq(siteAccessKeys.id, result[0].id));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating access key:', error);
    return false;
  }
}

// 设置访问令牌cookie
export async function setAccessToken(): Promise<void> {
  const token = generateAccessToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + ACCESS_TOKEN_EXPIRES_DAYS);
  
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

// 检查访问令牌
export async function checkAccessToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
    return !!token?.value;
  } catch (error) {
    console.error('Error checking access token:', error);
    return false;
  }
}

// 清除访问令牌
export async function clearAccessToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

// 创建新的访问密钥
export async function createAccessKey(data: {
  title?: string;
  created_by?: string;
  expires_at?: Date;
}): Promise<SiteAccessKey> {
  const key = generateAccessKey();
  const database = db();
  
  const result = await database
    .insert(siteAccessKeys)
    .values({
      access_key: key,
      title: data.title || null,
      created_by: data.created_by || null,
      expires_at: data.expires_at || null,
      created_at: new Date(),
      status: 'active',
      used_count: 0
    })
    .returning();

  return result[0] as SiteAccessKey;
}

// 获取所有访问密钥
export async function getAllAccessKeys(): Promise<SiteAccessKey[]> {
  const database = db();
  const result = await database
    .select()
    .from(siteAccessKeys)
    .orderBy(siteAccessKeys.created_at);
  
  return result as SiteAccessKey[];
}

// 更新访问密钥状态
export async function updateAccessKeyStatus(id: number, status: string): Promise<void> {
  const database = db();
  await database
    .update(siteAccessKeys)
    .set({ status })
    .where(eq(siteAccessKeys.id, id));
}

// 删除访问密钥
export async function deleteAccessKey(id: number): Promise<void> {
  const database = db();
  await database
    .delete(siteAccessKeys)
    .where(eq(siteAccessKeys.id, id));
}

// 检查是否启用了访问密钥功能
export function isSiteAccessEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SITE_ACCESS_ENABLED === 'true';
}