'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from "../ui/sidebar";
import {data} from "./sidebarData";
import Image from "next/image";
import { LayoutDashboard, Home, Receipt, TrendingUp, TrendingDown, LogIn, UserPlus, LucideIcon, FileUp, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Home,
  Receipt,
  TrendingUp,
  TrendingDown,
  LogIn,
  UserPlus,
  FileUp ,
  LogOut
};


export function SidebarData(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
   <aside className="h-full border-r max-w-full  bg-slate-50/40 dark:bg-slate-900/40 hidden md:flex flex-col">
         <SidebarProvider>
    <Sidebar {...props}>
      <SidebarHeader>
         <div className="px-4 py-3 font-bold text-lg text-slate-800 dark:text-white">
            <Image src="/home.png" alt="Logo" width={30} height={30} className="inline-block mr-2"/>
            Taneri Site Yönetimi
         </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup className=" " key={item.title}>
            <SidebarGroupLabel className="text-lg ">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item) => {

                  const IconComponent = item.icon ? iconMap[item.icon] : null;
                  // Mevcut pathname ile item URL'ini karşılaştır
                  // URL "#" ise veya pathname ile eşleşmiyorsa false
                  const isActive = item.url !== "#" && pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url ?? "#"} className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                         {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>  
   </SidebarProvider>
   </aside>

  )
}