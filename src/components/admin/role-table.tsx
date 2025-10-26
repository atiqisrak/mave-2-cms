"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";

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
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const getRoleTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  {role.name}
                  {role.color && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {role.slug}
                </code>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleTypeBadgeVariant(role.roleType)}>
                  {role.roleType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{role.level}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {role.permissions.length} permissions
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      System
                    </Badge>
                  )}
                  {role.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {!role.isAssignable && (
                    <Badge variant="destructive" className="text-xs">
                      Locked
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {role.createdAt ? format(new Date(role.createdAt), "MMM dd, yyyy") : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(role.id)}
                    className="text-destructive hover:text-destructive"
                    disabled={role.isSystem}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

