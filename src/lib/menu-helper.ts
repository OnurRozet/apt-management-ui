import { NavItem, UserRole } from "@/components/master-layout/sidebarData";

// Recursive (kendini tekrar eden) filtreleme fonksiyonu
export function filterMenuByRole(items: NavItem[], role: UserRole): NavItem[] {
  return items
    .filter(item => {
      // 1. Kural: Eğer 'roles' tanımlı değilse herkes görür.
      // Tanımlıysa, kullanıcının rolü bu listede var mı?
      const hasPermission = !item.roles || item.roles.includes(role);
      
      if (!hasPermission) return false;

      // 2. Kural: Eğer alt menüler varsa, onları da filtrele
      if (item.items && item.items.length > 0) {
        item.items = filterMenuByRole(item.items, role);
        
        // (Opsiyonel): Alt menüsü kalmayan başlıkları gizlemek istersen:
        // if (item.items.length === 0) return false;
      }

      return true;
    });
}