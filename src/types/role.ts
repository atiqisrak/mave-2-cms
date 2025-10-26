export interface Role {
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
  priority?: number;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

