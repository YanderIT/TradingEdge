'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import moment from 'moment';

interface SiteAccessKey {
  id: number;
  access_key: string;
  title: string | null;
  status: string;
  created_by: string | null;
  expires_at: Date | null;
  created_at: Date | null;
  used_count: number;
}

export default function SiteKeysPage() {
  const [keys, setKeys] = useState<SiteAccessKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // 创建表单状态
  const [newKey, setNewKey] = useState({
    title: '',
    expires_at: '',
  });

  // 加载所有密钥
  const loadKeys = async () => {
    try {
      const response = await fetch('/api/admin/site-keys');
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      } else {
        toast.error('Failed to load access keys');
      }
    } catch (error) {
      console.error('Error loading keys:', error);
      toast.error('Failed to load access keys');
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新密钥
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/admin/site-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newKey.title || null,
          expires_at: newKey.expires_at ? new Date(newKey.expires_at).toISOString() : null,
        }),
      });

      if (response.ok) {
        toast.success('Access key created successfully');
        setShowCreateDialog(false);
        setNewKey({ title: '', expires_at: '' });
        loadKeys();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to create access key');
      }
    } catch (error) {
      console.error('Error creating key:', error);
      toast.error('Failed to create access key');
    } finally {
      setIsCreating(false);
    }
  };

  // 更新密钥状态
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/site-keys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Access key ${status === 'active' ? 'activated' : 'deactivated'}`);
        loadKeys();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update access key');
      }
    } catch (error) {
      console.error('Error updating key:', error);
      toast.error('Failed to update access key');
    }
  };

  // 删除密钥
  const handleDeleteKey = async (id: number) => {
    if (!confirm('Are you sure you want to delete this access key?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/site-keys/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Access key deleted');
        loadKeys();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete access key');
      }
    } catch (error) {
      console.error('Error deleting key:', error);
      toast.error('Failed to delete access key');
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Site Access Keys</h1>
          <p className="text-lg text-muted-foreground">
            Manage access keys for site-wide authentication
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="shrink-0">
              <span className="hidden sm:inline">Create Access Key</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Access Key</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter key description"
                  value={newKey.title}
                  onChange={(e) => setNewKey(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expires_at">Expires At (Optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={newKey.expires_at}
                  onChange={(e) => setNewKey(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm text-muted-foreground">Loading access keys...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No access keys found</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Get started by creating your first access key for site-wide authentication.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  Create Your First Key
                </Button>
              </CardContent>
            </Card>
          ) : (
            keys.map((key) => (
              <Card key={key.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg leading-6">
                        {key.title || 'Untitled Key'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {key.access_key}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(key.status)} className="ml-3 shrink-0">
                      {key.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Used Count</p>
                        <p className="text-2xl font-semibold">{key.used_count}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                        <p className="text-sm">
                          {key.created_at ? moment(key.created_at).format('MMM DD, YYYY') : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {key.created_at ? moment(key.created_at).format('HH:mm:ss') : ''}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expires</p>
                        <p className="text-sm">
                          {key.expires_at ? moment(key.expires_at).format('MMM DD, YYYY') : 'Never'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {key.expires_at ? moment(key.expires_at).format('HH:mm:ss') : 'No expiration'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created By</p>
                        <p className="text-sm">{key.created_by || 'System'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Select
                        value={key.status}
                        onValueChange={(status) => handleUpdateStatus(key.id, status)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                        className="ml-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}