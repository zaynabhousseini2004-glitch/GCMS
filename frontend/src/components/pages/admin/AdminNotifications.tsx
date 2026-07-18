"use client";

import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/shared";
import {
  Button,
  Input,
  Textarea,
  Label,
  RadioGroup,
  RadioGroupItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Send } from "lucide-react";
import { useSendNotification, useAdminNotifications, useAdminStudents } from "@/hooks/mutations/useAdmin";
import { UserRole } from "@/lib/enums";

export default function AdminNotifications() {
  const [recipientMode, setRecipientMode] = useState<"all" | "specific">("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState("");

  const sendNotification = useSendNotification();
  const { data } = useAdminNotifications();
  const { data: studentsData } = useAdminStudents();
  const sentNotifications = data?.notifications ?? [];
  const allStudents = useMemo(() => studentsData?.students ?? [], [studentsData]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.toLowerCase();
    return allStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.universityId ?? "").toLowerCase().includes(q),
    );
  }, [allStudents, studentSearch]);

  const selectedStudent = allStudents.find((s) => s.id === targetUserId) ?? null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification.mutate(
      {
        title,
        message,
        targetRole: recipientMode === "all" ? UserRole.STUDENT : undefined,
        targetUserId: recipientMode === "specific" && targetUserId ? targetUserId : undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setMessage("");
          setTargetUserId(null);
          setStudentSearch("");
        },
      },
    );
  };

  return (
    <AdminLayout activeSidebarItem="Notifications">
      <h3 className="text-2xl font-semibold text-primary mb-6">Notifications</h3>

      <div className="bg-background rounded-xl shadow-md p-6 border border-border mb-8">
        <h4 className="text-lg font-bold text-foreground mb-6">Send New Notification</h4>

        <form className="space-y-6 max-w-3xl" onSubmit={handleSend}>
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Recipient</Label>
            <RadioGroup
              value={recipientMode}
              onValueChange={(v) => {
                setRecipientMode(v as "all" | "specific");
                setTargetUserId(null);
                setStudentSearch("");
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">All students on campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">Specific student</Label>
              </div>
            </RadioGroup>
          </div>

          {recipientMode === "specific" && (
            <div className="space-y-2">
              <Label>Select Student</Label>
              {selectedStudent ? (
                <div className="flex items-center justify-between border border-border rounded-md px-3 py-2 bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedStudent.fullName}</p>
                    <p className="text-xs text-muted-foreground">{selectedStudent.email}{selectedStudent.universityId ? ` · ${selectedStudent.universityId}` : ""}</p>
                  </div>
                  <button type="button" className="text-xs text-red-500 hover:underline ml-4" onClick={() => { setTargetUserId(null); setStudentSearch(""); }}>
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    placeholder="Search by name, email or university ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {studentSearch && (
                    <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-56 overflow-y-auto">
                      {filteredStudents.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-muted-foreground">No students found.</p>
                      ) : filteredStudents.slice(0, 20).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors"
                          onClick={() => { setTargetUserId(s.id); setStudentSearch(""); }}
                        >
                          <p className="text-sm font-medium text-foreground">{s.fullName}</p>
                          <p className="text-xs text-muted-foreground">{s.email}{s.universityId ? ` · ${s.universityId}` : ""}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notif-title">Notification Title</Label>
            <Input
              id="notif-title"
              placeholder="e.g. Important Update Regarding Ceremony"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif-message">Message</Label>
            <Textarea
              id="notif-message"
              placeholder="Type your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground pl-4 pr-6"
              disabled={sendNotification.isPending || (recipientMode === "specific" && !targetUserId)}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendNotification.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h4 className="text-lg font-bold text-foreground">Sent Notifications</h4>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[150px]">Sent Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sentNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No notifications sent yet.
                </TableCell>
              </TableRow>
            ) : (
              sentNotifications.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell className="font-medium text-foreground">{notif.title}</TableCell>
                  <TableCell
                    className="text-muted-foreground max-w-[300px] truncate"
                    title={notif.message}
                  >
                    {notif.message}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
