export interface SidebarDataType {
    versions: string[];
    navMain: {
        title?: string;
        url: string;
        icon?: string;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
            isActive?: boolean;
            icon?: string;
        }[];
    }[];
}

export const data: SidebarDataType = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Anasayfa",
      url: "#",
      items: [
        {
          title: "Yönetim Paneli",
          url: "/",
          icon: "LayoutDashboard",
        },
        {
          title: "Daireler",
          url: "/flats",
          icon: "Home",
        },
        {
          title: "Aidat Takibi",
          url: "/dues",
          icon: "Receipt",
        },
        {
          title: "Gelirler",
          url: "/incomes",
          icon: "TrendingUp",
        },
        {
          title: "Giderler",
          url: "/expenses",
          icon: "TrendingDown",
        },
         {
          title: "Excel ile Gelir-Gider Yükleme",
          url: "/excel-upload",
          icon: "FileUp",
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
        url: "#",
        items: [
            {
                title: "Giriş Yap",
                url: "#",
                icon: "LogIn"
            },
            {
                title: "Kayıt Ol",
                url: "#",
                icon: "UserPlus"
            },
        ],
    }
  ],
};

