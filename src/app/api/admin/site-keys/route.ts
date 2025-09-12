import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from '@/services/user';
import { getAllAccessKeys, createAccessKey } from '@/services/siteAccess';

// 获取所有访问密钥
export async function GET() {
  try {
    // 检查管理员权限
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',');
    if (!adminEmails?.includes(userInfo.email)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const keys = await getAllAccessKeys();
    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching site keys:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 创建新的访问密钥
export async function POST(request: NextRequest) {
  try {
    // 检查管理员权限
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',');
    if (!adminEmails?.includes(userInfo.email)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { title, expires_at } = await request.json();

    const newKey = await createAccessKey({
      title,
      created_by: userInfo.email,
      expires_at: expires_at ? new Date(expires_at) : undefined,
    });

    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    console.error('Error creating site key:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}