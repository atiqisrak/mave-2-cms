"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";

interface CreateRoleInput {
  name: string;
  slug: string;
  description?: string;
  permissions?: string[];
  color?: string;
  icon?: string;
  priority?: number;
  level?: number;
  roleType?: string;
  isAssignable?: boolean;
  isDefault?: boolean;
  organizationId?: string;
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleInput) => void;
}

export function CreateRoleModal({
  isOpen,
  onOpenChange,
  onSubmit,
}: CreateRoleModalProps) {
  const [form, setForm] = useState<CreateRoleInput>({
    name: "",
    slug: "",
    description: "",
    roleType: "custom",
    isAssignable: true,
    isDefault: false,
    priority: 0,
    level: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Create a new role with specific permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Administrator"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="administrator"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Role description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleType">Role Type</Label>
              <Select
                value={form.roleType}
                onValueChange={(value) =>
                  setForm({ ...form, roleType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                value={form.level || 1}
                onChange={(e) =>
                  setForm({ ...form, level: parseInt(e.target.value) })
                }
                min="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              value={form.priority || 0}
              onChange={(e) =>
                setForm({ ...form, priority: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color (hex)</Label>
            <Input
              id="color"
              type="color"
              value={form.color || "#000000"}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="assignable"
              checked={form.isAssignable}
              onCheckedChange={(checked) =>
                setForm({ ...form, isAssignable: checked })
              }
            />
            <Label htmlFor="assignable">Assignable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="default"
              checked={form.isDefault}
              onCheckedChange={(checked) =>
                setForm({ ...form, isDefault: checked })
              }
            />
            <Label htmlFor="default">Default Role</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

