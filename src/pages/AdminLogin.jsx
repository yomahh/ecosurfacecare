import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5faf7] p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-[#176B1C]"><LockKeyhole /></div>
        <h1 className="mt-5 text-3xl font-bold">Owner login</h1>
        <p className="mt-3 text-slate-600">Demonstration screen. Production access will be protected by Cloudflare Access.</p>
        <form className="mt-7 grid gap-4" onSubmit={(e)=>{e.preventDefault();navigate("/admin/dashboard");}}>
          <input className="rounded-xl border border-slate-300 px-4 py-3" type="email" placeholder="Approved owner email" />
          <button className="rounded-full bg-[#228B22] px-6 py-3 font-bold text-white">Continue to dashboard</button>
        </form>
        <Link to="/" className="mt-6 block text-center font-semibold text-[#176B1C]">Return to website</Link>
      </section>
    </main>
  );
}
