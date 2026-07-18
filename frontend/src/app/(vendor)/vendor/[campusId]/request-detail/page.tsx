import { VendorRequestDetail } from "@/components/pages/vendor";

interface Props {
  searchParams: { id?: string };
}

export default function VendorRequestDetailPage({ searchParams }: Props) {
  const requestId = Number(searchParams.id ?? "0");
  return <VendorRequestDetail requestId={requestId} />;
}
