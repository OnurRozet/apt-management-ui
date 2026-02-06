"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "../ui/sidebar";
import { data, NavItem, UserRole } from "./sidebarData";
import {
  LayoutDashboard,
  Home,
  Receipt,
  TrendingUp,
  TrendingDown,
  LogIn,
  UserPlus,
  LucideIcon,
  FileUp,
  LogOut,
  User,
  ChevronsLeft,
  ChevronsRight,
  Tags,
  Settings,
  UserCog,
  Calculator,
  ShieldPlus,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "../ui/badge";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Home,
  Receipt,
  TrendingUp,
  TrendingDown,
  LogIn,
  UserPlus,
  FileUp,
  LogOut,
  Tags,
  Settings,
  UserCog,
  Calculator,
  ShieldPlus,
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const { user, isLoading } = useAuth();
  const isCollapsed = state === "collapsed";

  // Kullanıcının rolünü belirle
  const userRole: UserRole = user?.isManager ? "Admin" : "User";

  // Rol bazlı menü filtreleme
  const hasAccess = (item: NavItem): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  };

  // Menü gruplarını filtrele
  const filteredNavMain = data.navMain
    .map((group) => ({
      ...group,
      items: group.items.filter(hasAccess),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur supports-backdrop-filter:bg-sidebar/60"
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Home className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg text-sidebar-foreground">
              Taneri
            </span>
            <span className="text-xs text-muted-foreground">Site Yönetimi</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-muted-foreground/70 font-medium">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((subItem) => {
                  const IconComponent = subItem.icon
                    ? iconMap[subItem.icon]
                    : null;
                  const isActive =
                    subItem.url !== "#" && pathname === subItem.url;

                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={subItem.title}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground transition-all duration-200"
                      >
                        <Link
                          href={subItem.url ?? "#"}
                          className="flex items-center gap-3"
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                          )}
                          <span>{subItem.title}</span>
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

      <SidebarFooter>
        {/* Toggle Button */}
        <div className="p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 justify-start group-data-[collapsible=icon]:justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Daralt
                </span>
              </>
            )}
          </Button>
        </div>

        {/* User Info */}
        <div className="p-2">
          <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2 text-sidebar-foreground shadow-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
              {user?.isManager ? (
                <Shield className="size-4" />
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden group-data-[collapsible=icon]:hidden">
              {isLoading ? (
                <span className="text-xs text-muted-foreground">
                  Yükleniyor...
                </span>
              ) : user ? (
                <>
                  <span className="truncate font-semibold">
                    {user.fullName}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs text-muted-foreground">
                      Daire No: {user.apartmentNumber}
                    </span>
                    {user.isManager && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1 text-[10px]"
                      >
                        Rol: {user.isManager ? "Yönetici" : "Kullanıcı"}
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Giriş yapılmadı
                </span>
              )}
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
