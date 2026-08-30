import Link from "next/link";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getUniversities } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const universities = await getUniversities();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-brand text-lg font-bold tracking-tight text-ink lg:hidden">
            SIDEQUEST
          </Link>
          <h1 className="mt-8 font-display text-3xl font-semibold text-ink lg:mt-0">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join SideQuest to save events and start publishing.</p>

          <RegisterForm universities={universities} />
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
