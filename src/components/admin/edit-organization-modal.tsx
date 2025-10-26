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

interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateOrganizationInput {
  name?: string;
  domain?: string;
  plan?: string;
  isActive?: boolean;
}

interface EditOrganizationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  onSubmit: (data: UpdateOrganizationInput) => void;
}

export function EditOrganizationModal({
  isOpen,
  onOpenChange,
  organization,
  onSubmit,
}: EditOrganizationModalProps) {
  const [form, setForm] = useState<UpdateOrganizationInput>({});

  // Update form when organization changes
  React.useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name,
        domain: organization.domain || "",
        plan: organization.plan,
        isActive: organization.isActive,
      });
    }
  }, [organization]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update organization details and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Organization Name</Label>
            <Input
              id="edit-name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter organization name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input
              id="edit-slug"
              value={organization.slug}
              disabled
              className="bg-muted"
              placeholder="organization-slug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Domain</Label>
            <Input
              id="edit-domain"
              value={form.domain || ""}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              placeholder="example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-plan">Plan</Label>
            <Select
              value={form.plan || ""}
              onValueChange={(value) => setForm({ ...form, plan: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={form.isActive || false}
              onCheckedChange={(checked) =>
                setForm({ ...form, isActive: checked })
              }
            />
            <Label htmlFor="edit-active">Active</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Organization</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
