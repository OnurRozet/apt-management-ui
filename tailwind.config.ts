import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  // Shadcn kullanacağımız için dark mode desteğini 'class' olarak belirtiyoruz
  // Tailwind'in hangi dosyalardaki class'ları okuyacağını burası belirler
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Senin o özel gradyanını buraya bir isimle tanımlıyoruz
        "mesh-gradient": "var(--app-bg-gradient)",
        // tailwind.config.ts içinde güncelle:

        "app-gradient":
          "#FFFFFF",
      },
      // Shadcn'in düzgün çalışması için gerekli olan renk değişkenleri
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [tailwindcssAnimate], // Shadcn animasyonları için şart
};

export default config;