import { NavbarAdmin } from "./components/layout/navbar/navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarAdmin />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {children}
      </main>
    </>
  );
}
