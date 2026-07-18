"use client";

import { useState } from "react";
import { SuperadminLayout } from "@/components/shared";
import {
  Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Avatar, AvatarFallback, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Badge,
} from "@/components/ui";
import { UserMinus } from "lucide-react";
import {
  useCampuses,
  useCampusAdmins,
  useRemoveAdminFromCampus,
} from "@/hooks/mutations/useSuperadmin";
import { UserStatus } from "@/lib/enums";

export function SACampusAdmins() {
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);

  const { data: campusData } = useCampuses();
  const { data: adminsData, isLoading } = useCampusAdmins(selectedCampusId ?? 0);
  const removeAdmin = useRemoveAdminFromCampus();

  const campuses = campusData?.campuses ?? [];
  const admins = adminsData?.admins ?? [];

  return (
    <SuperadminLayout activeSidebarItem="Campus Admins">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">Campus Admins</h3>
            <div className="w-64">
              <Select
                value={selectedCampusId ? String(selectedCampusId) : ""}
                onValueChange={(v) => setSelectedCampusId(Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
                <SelectContent>
                  {campuses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {!selectedCampusId ? (
          <p className="text-muted-foreground text-center py-12">Select a campus to view its admins.</p>
        ) : (
          <Card className="shadow-sm">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : admins.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No admins for this campus.</TableCell></TableRow>
                ) : admins.map((admin, i) => (
                  <TableRow key={admin.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{admin.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{admin.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                    <TableCell className="text-muted-foreground">{admin.phone ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={admin.status === UserStatus.ACTIVE ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                        onClick={() => removeAdmin.mutate({ adminId: admin.id, campusId: selectedCampusId! })}>
                        <UserMinus className="w-4 h-4" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </SuperadminLayout>
  );
}
