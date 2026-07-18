import { redirect } from "next/navigation";

interface Props { params: Promise<{ campusId: string }> }

export default async function AdminHomePage({ params }: Props) {
  const { campusId } = await params;
  redirect(`/admin/${campusId}/dashboard`);
}
