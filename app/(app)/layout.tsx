// app/(app)/layout.tsx
import AnnouncementBar from "@/components/shared/AnnouncementBar";
import DynamicFooter from "@/components/shared/DynamicFooter";
import FloatingActions from "@/components/shared/FloatingActions";
import GlobalHeader from "@/components/home/GlobalHeader";

export default function AppGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen">
      <AnnouncementBar />
      <GlobalHeader />  
      <div>
        {children}
        <DynamicFooter />
        <FloatingActions />
      </div>
    </main>
  );
}