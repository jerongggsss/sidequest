import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full bg-ink lg:block">
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden p-10 text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/25 blur-[110px]" />
          <div className="absolute bottom-[5%] right-[-10%] h-[300px] w-[300px] rounded-full bg-brand/15 blur-[100px]" />
          <div className="bg-grid absolute inset-0 opacity-30" />
        </div>

        <Link href="/" className="relative z-10 font-brand text-lg font-bold tracking-tight">
          SIDEQUEST
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-sm -rotate-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur">
          <div className="relative aspect-4/5 w-full">
            <Image src="/images/loginimage.jpg" alt="SideQuest Login" fill className="object-cover" sizes="360px" />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-5">
              <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                SIDEQUEST
              </span>
              <p className="flex items-center gap-1.5 font-display text-xl font-semibold text-white">
                Find your next adventure.
              </p>
              <p className="mt-1 text-xs text-white/70">
                Discover events, communities, and organizations around campus — all in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 h-[15vh]" aria-hidden>
          {/* Acts as a bottom spacer to push the center image slightly higher in the viewport */}
        </div>
      </div>
    </div>
  );
}
