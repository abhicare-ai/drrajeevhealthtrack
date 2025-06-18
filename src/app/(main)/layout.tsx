import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import StoreProvider from "./SetionProvider";
import SetionProvider from "./StoreProvider";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import BreadcrumbMain from "@/components/BreadcrumbMain";
import HandlerSerchBar from "@/components/HandlerSerchBar";
import { Bell } from "lucide-react";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  return (
    <StoreProvider>
      <SetionProvider value={session}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="bg-sidebar sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex w-full items-center gap-2 px-3 md:flex-row flex-col">
             
                <div className="flex items-center gap-2 md:w-1/2">
                  <SidebarTrigger className="-ml-1 " />
                  <Separator orientation="vertical" className="mr-2 h-4 " />
                  <Breadcrumb>
                    <BreadcrumbMain />
                  </Breadcrumb>
                </div>
                <div className="flex items-center justify-end gap-2 md:w-1/2">
                  <HandlerSerchBar />
                  <Bell />
                </div>
              </div>
            </header>
            <>{children}</>
          </SidebarInset>
        </SidebarProvider>
      </SetionProvider>
    </StoreProvider>
  );
}
