export type UserRole = "Admin" | "User";

export interface NavItem {
  title: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  // İŞTE SİHİR BURADA: Bu öğeyi kimler görebilir?
  // Eğer undefined ise herkes görür.
  roles?: UserRole[];
  items?: NavItem[]; // Alt menüler için recursive yapı
}

export interface SidebarDataType {
  versions: string[];
  navMain: {
    title?: string;
    items: NavItem[];
  }[];
}

export const data: SidebarDataType = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Anasayfa",
      items: [
        {
          title: "Yönetim Paneli",
          url: "/reports",
          icon: "LayoutDashboard",
          roles: ["Admin", "User"], // Admin ve User görebilir
        },
        {
          title: "Daireler",
          url: "/flats",
          icon: "Home",
          roles: ["Admin"], // Sadece Admin görebilir
        },
        {
          title: "Aidat Takibi",
          url: "/dues",
          icon: "Receipt",
          roles: ["Admin", "User"],
        },
        {
          title: "Gelirler",
          url: "/incomes",
          icon: "TrendingUp",
          roles: ["Admin", "User"],
        },
        {
          title: "Giderler",
          url: "/expenses",
          icon: "TrendingDown",
          roles: ["Admin", "User"],
        },
        {
          title: "Excel ile Gelir-Gider Yükleme",
          url: "/excel-upload",
          icon: "FileUp",
          roles: ["Admin"],
        },
      ],
    },
    {
      title: "Ayarlar",
      items: [
        {
          title: "Gelir Kategorisi",
          url: "/income-categories",
          icon: "WalletCards",
          roles: ["Admin"],
        },
        {
          title: "Gider Kategorisi",
          url: "/expense-categories",
          icon: "Tags",
          roles: ["Admin"],
        },
        {
          title: "Aidat Tutarı Belirle",
          url: "/dues-settings",
          icon: "Calculator",
          roles: ["Admin"],
        },
        {
          title: "Site Yöneticisi Belirle",
          url: "/management-period",
          icon: "ShieldPlus",
          roles: ["Admin"],
        },
      ],
    },
    {
      title: "Kullanıcı İşlemleri",
      items: [
        {
          title: "Çıkış Yap",
          icon: "LogOut",
          url: "/auth/logout",
        },
      ],
    },
  ],
};
