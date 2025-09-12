import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from '@/services/user';
import { updateAccessKeyStatus, deleteAccessKey } from '@/services/siteAccess';

// 更新访问密钥状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const keyId = parseInt(id);
    if (isNaN(keyId)) {
      return NextResponse.json({ message: 'Invalid key ID' }, { status: 400 });
    }

    const { status } = await request.json();
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await updateAccessKeyStatus(keyId, status);

    return NextResponse.json({ message: 'Access key updated successfully' });
  } catch (error) {
    console.error('Error updating site key:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 删除访问密钥
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const keyId = parseInt(id);
    if (isNaN(keyId)) {
      return NextResponse.json({ message: 'Invalid key ID' }, { status: 400 });
    }

    await deleteAccessKey(keyId);

    return NextResponse.json({ message: 'Access key deleted successfully' });
  } catch (error) {
    console.error('Error deleting site key:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}