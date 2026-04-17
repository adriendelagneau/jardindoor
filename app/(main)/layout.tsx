import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <AppSidebar />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
