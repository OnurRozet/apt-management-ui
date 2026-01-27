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
          roles: ["Admin"], // Sadece Admin görebilir
        },
        {
          title: "Daireler",
          url: "/flats",
          icon: "Home",
          roles: ["Admin", "User"], // Hem Admin hem de User görebilir
        },
        {
          title: "Aidat Takibi",
          url: "/dues",
          icon: "Receipt",
          roles: ["Admin"],
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
    // {
    //   title: "Raporlar",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Routing",
    //       url: "#",
    //     },
    //     {
    //       title: "Data Fetching",
    //       url: "#",
    //       isActive: true,
    //     },
    //     {
    //       title: "Rendering",
    //       url: "#",
    //     },
    //     {
    //       title: "Caching",
    //       url: "#",
    //     },
    //     {
    //       title: "Styling",
    //       url: "#",
    //     },
    //     {
    //       title: "Optimizing",
    //       url: "#",
    //     },
    //     {
    //       title: "Configuring",
    //       url: "#",
    //     },
    //     {
    //       title: "Testing",
    //       url: "#",
    //     },
    //     {
    //       title: "Authentication",
    //       url: "#",
    //     },
    //     {
    //       title: "Deploying",
    //       url: "#",
    //     },
    //     {
    //       title: "Upgrading",
    //       url: "#",
    //     },
    //     {
    //       title: "Examples",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Ayarlar",
      items: [
        {
          title: "Gelir Kategorisi",
          url: "/income-categories",
          icon: "TrendingUp",
          roles: ["Admin"],
        },
        {
          title: "Gider Kategorisi",
          url: "/expense-categories",
          icon: "TrendingDown",
          roles: ["Admin"],
        },
        {
          title: "Aidat Tutarı Belirle",
          url: "/dues-settings",
          icon: "Receipt",
          roles: ["Admin"],
        },
        {
          title: "Site Yöneticisi Ekle",
          url: "/management-period",
          icon: "Receipt",
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



