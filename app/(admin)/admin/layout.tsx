import { NavbarAdmin } from "./components/layout/navbar/navbar";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarAdmin />
      <AppSidebar />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-16">
        {children}
      </main>
    </>
  );
}
