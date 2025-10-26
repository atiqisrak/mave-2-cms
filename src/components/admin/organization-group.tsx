"use client";

import { Badge } from "@/components/ui/badge";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  status: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  roles: Array<{
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      slug: string;
      color?: string;
      icon?: string;
    };
    scope: string;
    isActive: boolean;
  }>;
}

interface OrganizationGroupProps {
  org: Organization;
  users: User[];
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function OrganizationGroup({
  org,
  users,
  isExpanded,
  onToggle,
  children,
}: OrganizationGroupProps) {
  return (
    <div className="border rounded-lg">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{org.name}</h3>
            <p className="text-sm text-muted-foreground">
              {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Badge variant="outline">{org.slug}</Badge>
      </div>

      {isExpanded && <div className="border-t">{children}</div>}
    </div>
  );
}
