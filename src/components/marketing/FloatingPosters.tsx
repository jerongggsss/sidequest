import Image from "next/image";

const POSTERS = [
  { src: "/images/universitytalk.jpg", label: "UNIVERSITY TALKS", meta: "13 April · ONLINE" },
  { src: "/images/theatre-poster.jpg", label: "Theatre Day", meta: "Ticket Only" },
  { src: "/images/musicday-poster.jpg", label: "MUSIC DAY", meta: "REGISTER NOW" },
  { src: "/images/matchday-poster.jpg", label: "MATCHDAY", meta: "FRIENDLY" },
];

export function FloatingPosters() {
  const positions = [
    "left-[2%] top-[8%] w-36 sm:w-44 lg:w-52 rotate-[-8deg]",
    "right-[4%] top-[4%] w-32 sm:w-40 lg:w-48 rotate-[6deg]",
    "left-[8%] bottom-[6%] w-32 sm:w-36 lg:w-44 rotate-[5deg]",
    "right-[8%] bottom-[10%] w-36 sm:w-44 lg:w-52 rotate-[-5deg]",
  ];
  const floatClass = ["animate-float-slow", "animate-float-slower", "animate-float-slow", "animate-float-slower"];

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {POSTERS.map((p, i) => (
        <div
          key={p.src}
          className={`absolute ${positions[i]} ${floatClass[i]} overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl`}
          style={{ ["--rot" as string]: "0deg" }}
        >
          <div className="relative aspect-4/5 w-full">
            <Image src={p.src} alt="" fill className="object-cover opacity-90" sizes="220px" />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-3">
              <p className="font-brand text-xs font-semibold text-white">{p.label}</p>
              <p className="text-[10px] text-white/70">{p.meta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
