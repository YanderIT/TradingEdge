import { NextRequest, NextResponse } from 'next/server';
import { validateAccessKey, setAccessToken } from '@/services/siteAccess';

export async function POST(request: NextRequest) {
  try {
    const { access_key } = await request.json();
    
    if (!access_key || typeof access_key !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Access key is required' },
        { status: 400 }
      );
    }

    // 验证访问密钥
    const isValid = await validateAccessKey(access_key);
    
    if (isValid) {
      // 设置访问令牌cookie
      await setAccessToken();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Access granted' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired access key' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Site access verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}