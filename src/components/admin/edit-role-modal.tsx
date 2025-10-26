"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthService } from "@/hooks/use-auth-service";

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isSystem: boolean;
  isAssignable: boolean;
  isDefault: boolean;
  permissions: string[];
  level: number;
  roleType: string;
  priority: number;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
  color?: string;
  icon?: string;
  priority?: number;
  level?: number;
  isAssignable?: boolean;
  isDefault?: boolean;
}

interface EditRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSubmit: (data: UpdateRoleInput) => void;
}

export function EditRoleModal({
  isOpen,
  onOpenChange,
  role,
  onSubmit,
}: EditRoleModalProps) {
  const { isSuperAdmin } = useAuthService();
  const [form, setForm] = useState<UpdateRoleInput>({});

  // Update form when role changes
  React.useEffect(() => {
    if (role) {
      setForm({
        name: role.name,
        description: role.description || "",
        isAssignable: role.isAssignable,
        isDefault: role.isDefault,
        level: role.level,
        color: role.color,
        priority: role.priority,
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role details and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Role Name</Label>
            <Input
              id="edit-name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter role name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input
              id="edit-slug"
              value={role.slug}
              disabled
              className="bg-muted"
              placeholder="role-slug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Role description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-level">Level</Label>
              <Input
                id="edit-level"
                type="number"
                value={form.level || 1}
                onChange={(e) =>
                  setForm({ ...form, level: parseInt(e.target.value) })
                }
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Input
                id="edit-priority"
                type="number"
                value={form.priority || 0}
                onChange={(e) =>
                  setForm({ ...form, priority: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-color">Color (hex)</Label>
            <Input
              id="edit-color"
              type="color"
              value={form.color || role.color || "#000000"}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-assignable"
                checked={form.isAssignable ?? true}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isAssignable: checked })
                }
                disabled={role.isSystem && !isSuperAdmin()}
              />
              <Label htmlFor="edit-assignable" className="cursor-pointer">
                Assignable
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Whether this role can be assigned to users
            </p>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-default"
                checked={form.isDefault ?? false}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isDefault: checked })
                }
                disabled={role.isSystem && !isSuperAdmin()}
              />
              <Label htmlFor="edit-default" className="cursor-pointer">
                Default Role
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Automatically assign to new users in this organization
            </p>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-system"
                checked={role.isSystem}
                disabled
              />
              <Label htmlFor="edit-system" className="cursor-not-allowed text-muted-foreground">
                System Role
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              System roles are global and cannot be modified. Organization: {role.organizationId || "System-wide"}
            </p>
            {!isSuperAdmin() && role.isSystem && (
              <p className="text-xs text-amber-500 ml-6 font-medium">
                Note: Only super admins can modify system roles
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={role.isSystem && !isSuperAdmin()}>
              Update Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

