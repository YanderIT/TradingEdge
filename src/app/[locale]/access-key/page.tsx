'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AccessKeyPage() {
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('access_key');
  
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessKey.trim()) {
      toast.error(t('error.empty_key'));
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/site-access/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_key: accessKey }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(t('success.verified'));
        // 设置cookie后重定向
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      } else {
        toast.error(data.message || t('error.invalid_key'));
      }
    } catch (error) {
      console.error('Access key verification error:', error);
      toast.error(t('error.network'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            {/* Project Logo */}
            <div className="w-16 h-16 mx-auto mb-6">
              <Image
                src="/logo.png"
                alt="AlphaOption"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('placeholder')}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('buttons.verifying') : t('buttons.verify')}
            </Button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © 2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}