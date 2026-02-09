
import type { ReactNode } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSideBar from "../components/DashboardSideBar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F6F9FF] flex">
      {/* SIDEBAR */}
      <DashboardSideBar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* TOP NAV */}
        <DashboardNavbar />

        {/* PAGE CONTENT */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
