"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Mail, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRoles } from '@/hooks/use-roles';
import { useCreateShareableInviteLinkMutation } from '@/store/api/invitationApi';

interface InviteUserCardProps {
  organizationId?: string;
  onInviteSuccess?: () => void;
}

export function InviteUserCard({ organizationId, onInviteSuccess }: InviteUserCardProps) {
  const [formData, setFormData] = useState({
    roleId: '',
    expiresInDays: 7,
    maxUses: 10,
  });

  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const [createShareableInviteLink, { isLoading, error: inviteError }] = useCreateShareableInviteLinkMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleId) {
      toast.error('Please select a role');
      return;
    }

    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    try {
      const result = await createShareableInviteLink({
        organizationId,
        roleId: formData.roleId,
        expiresInDays: formData.expiresInDays,
        maxUses: formData.maxUses,
      }).unwrap();

      // Copy the invitation link to clipboard
      const invitationLink = `${window.location.origin}/auth/invite/${result.token}`;
      await navigator.clipboard.writeText(invitationLink);
      
      toast.success('Shareable invitation link created and copied to clipboard!');
      setFormData({ roleId: '', expiresInDays: 7, maxUses: 10 });
      onInviteSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create invitation link';
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Invitation Link
        </CardTitle>
        <CardDescription>
          Generate a shareable link to invite team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <select
              id="invite-role"
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={formData.roleId}
              onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
              disabled={isLoading || rolesLoading}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {rolesError && (
              <p className="text-sm text-red-500">Failed to load roles</p>
            )}
            {inviteError && (
              <p className="text-sm text-red-500">Failed to create invitation link</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires-days">Expires in (days)</Label>
            <Input
              id="expires-days"
              type="number"
              min="1"
              max="30"
              value={formData.expiresInDays}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) || 7 }))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-uses">Maximum uses</Label>
            <Input
              id="max-uses"
              type="number"
              min="1"
              max="100"
              value={formData.maxUses}
              onChange={(e) => setFormData(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 10 }))}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || rolesLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : rolesLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading roles...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Invitation Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
