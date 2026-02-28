import HubSubNav from "@/components/layout/HubSubNav";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HubSubNav />
      {children}
    </div>
  );
}
