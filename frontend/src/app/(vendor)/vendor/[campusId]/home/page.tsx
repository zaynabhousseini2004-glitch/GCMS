import { redirect } from "next/navigation";

interface Props { params: Promise<{ campusId: string }> }

export default async function VendorHomePage({ params }: Props) {
  const { campusId } = await params;
  redirect(`/vendor/${campusId}/dashboard`);
}
