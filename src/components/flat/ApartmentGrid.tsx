// "use client";

// import { useState } from "react";
// import ApartmentCard from "./ApartmentCard";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Apartment } from "@/types";

// export default function ApartmentGrid({ data }: { data: Apartment[] }) {
//   const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data.map((apt) => (
//           <ApartmentCard key={apt.id} {...apt} onClick={() => setSelectedApt(apt)} />
//         ))}
//       </div>

//       <Dialog open={!!selectedApt} onOpenChange={() => setSelectedApt(null)}>
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold border-b pb-4">
//               {selectedApt?.block} Blok - Daire {selectedApt?.number} Detayları
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="py-4 space-y-6">
//             {/* Finansal Özet */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-4 bg-slate-50 rounded-lg">
//                 <p className="text-sm text-muted-foreground">Mevcut Bakiye</p>
//                 <p className={`text-2xl font-bold ${selectedApt && selectedApt.balance < 0 ? "text-red-500" : "text-emerald-500"}`}>
//                   {selectedApt?.balance.toLocaleString('tr-TR')} ₺
//                 </p>
//               </div>
//               <div className="p-4 bg-slate-50 rounded-lg">
//                 <p className="text-sm text-muted-foreground">Durum</p>
//                 <p className="text-xl font-semibold capitalize">{selectedApt?.status}</p>
//               </div>
//             </div>

//             {/* Hareketler Tablosu */}
//             <div>
//               <h3 className="font-bold mb-3">Son Hareketler</h3>
//               <div className="space-y-2">
//                 {selectedApt?.transactions.map((t, i) => (
//                   <div key={i} className="flex justify-between p-3 border rounded-sm hover:bg-slate-50 transition-colors">
//                     <div className="flex flex-col">
//                       <span className="font-medium">{t.description}</span>
//                       <span className="text-xs text-muted-foreground">{t.date}</span>
//                     </div>
//                     <span className={`font-mono font-bold ${t.amount < 0 ? "text-red-500" : "text-emerald-500"}`}>
//                       {t.amount > 0 ? "+" : ""}{t.amount} ₺
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }