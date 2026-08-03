import { useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Images, LogOut, Pencil, Trash2, Video } from "lucide-react";
import { galleryItems } from "../data/gallery";

export default function AdminDashboard() {
  const [items, setItems] = useState(galleryItems);
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white"><div className="container-site flex h-20 items-center justify-between"><div><p className="text-sm text-slate-500">EcoSurfaceCare</p><h1 className="text-xl font-bold">Gallery dashboard</h1></div><Link to="/" className="flex items-center gap-2 font-semibold text-[#0b6f63]"><LogOut size={18}/>Exit</Link></div></header>
      <main className="container-site py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {[[Images,"Published photos",items.length],[Video,"Videos",0],[ImagePlus,"Draft items",0]].map(([Icon,label,value])=><div key={label} className="rounded-3xl bg-white p-6 shadow-sm"><Icon className="text-[#0b6f63]"/><p className="mt-5 text-3xl font-bold">{value}</p><p className="text-slate-500">{label}</p></div>)}
        </div>
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Gallery items</h2><p className="text-slate-500">Add, edit, publish or remove project media.</p></div><button className="rounded-full bg-[#0b6f63] px-5 py-3 font-bold text-white">+ Add new project</button></div>
          <div className="mt-7 grid gap-4">
            {items.map(item=><div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"><img src={item.image} alt="" className="h-20 w-24 rounded-xl object-cover"/><div className="flex-1"><h3 className="font-bold">{item.title}</h3><p className="text-sm text-slate-500">{item.category} · {item.location}</p></div><div className="flex gap-2"><button className="rounded-lg border border-slate-300 p-2" aria-label="Edit"><Pencil size={18}/></button><button onClick={()=>setItems(items.filter(x=>x.id!==item.id))} className="rounded-lg border border-red-200 p-2 text-red-600" aria-label="Delete"><Trash2 size={18}/></button></div></div>)}
          </div>
          <p className="mt-6 text-sm text-slate-500">This dashboard currently demonstrates the interface only. D1, R2 uploads, authentication and permanent editing will be connected in the backend phase.</p>
        </section>
      </main>
    </div>
  );
}
