export const CATEGORIES = [
  "Workshop",
  "Competition",
  "Sports",
  "Talk",
  "Volunteering",
  "Career",
  "Technology",
  "Arts",
  "Academic",
  "Social",
] as const;

export type EventCategory = (typeof CATEGORIES)[number];

export const UNIVERSITIES = [
  { slug: "ums", name: "Universiti Malaysia Sabah", city: "Kota Kinabalu" },
  { slug: "uitm", name: "Universiti Teknologi MARA", city: "Shah Alam" },
  { slug: "utm", name: "Universiti Teknologi Malaysia", city: "Johor Bahru" },
  { slug: "um", name: "Universiti Malaya", city: "Kuala Lumpur" },
  { slug: "usm", name: "Universiti Sains Malaysia", city: "Penang" },
  { slug: "upm", name: "Universiti Putra Malaysia", city: "Serdang" },
  { slug: "unimas", name: "Universiti Malaysia Sarawak", city: "Kota Samarahan" },
] as const;

export const CATEGORY_GRADIENTS: Record<string, string> = {
  Workshop: "from-indigo-500/30 to-slate-900",
  Competition: "from-rose-500/25 to-slate-900",
  Sports: "from-orange-500/25 to-slate-900",
  Talk: "from-sky-500/25 to-slate-900",
  Volunteering: "from-emerald-500/25 to-slate-900",
  Career: "from-amber-500/25 to-slate-900",
  Technology: "from-violet-500/30 to-slate-900",
  Arts: "from-fuchsia-500/25 to-slate-900",
  Academic: "from-cyan-500/25 to-slate-900",
  Social: "from-indigo-500/25 to-slate-900",
};
