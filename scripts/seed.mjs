import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

function nanoid(len = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const UNIVERSITIES = [
  { slug: "ums", name: "Universiti Malaysia Sabah", city: "Kota Kinabalu" },
  { slug: "uitm", name: "Universiti Teknologi MARA", city: "Shah Alam" },
  { slug: "utm", name: "Universiti Teknologi Malaysia", city: "Johor Bahru" },
  { slug: "um", name: "Universiti Malaya", city: "Kuala Lumpur" },
  { slug: "usm", name: "Universiti Sains Malaysia", city: "Penang" },
  { slug: "upm", name: "Universiti Putra Malaysia", city: "Serdang" },
  { slug: "unimas", name: "Universiti Malaysia Sarawak", city: "Kota Samarahan" },
];

async function main() {
  const client = await pool.connect();
  try {
    console.log("Seeding universities...");
    const uniIds = {};
    for (const u of UNIVERSITIES) {
      const existing = await client.query("select id from universities where slug=$1", [u.slug]);
      if (existing.rows[0]) {
        uniIds[u.slug] = existing.rows[0].id;
        continue;
      }
      const id = nanoid();
      await client.query(
        "insert into universities (id, name, slug, city) values ($1,$2,$3,$4)",
        [id, u.name, u.slug, u.city],
      );
      uniIds[u.slug] = id;
    }

    const demoEmail = "demo@sidequest.my";
    let userRes = await client.query("select id from users where email=$1", [demoEmail]);
    let userId;
    if (userRes.rows[0]) {
      userId = userRes.rows[0].id;
    } else {
      userId = nanoid();
      const passwordHash = await bcrypt.hash("sidequest123", 10);
      await client.query(
        "insert into users (id, name, email, password_hash, university_id, bio) values ($1,$2,$3,$4,$5,$6)",
        [userId, "Aiman Studio", demoEmail, passwordHash, uniIds.ums, "Running events for the campus community."],
      );
      console.log("Created demo organizer account: demo@sidequest.my / sidequest123");
    }

    let orgRes = await client.query("select id from organizations where slug=$1", ["prsiswa"]);
    let orgId;
    if (orgRes.rows[0]) {
      orgId = orgRes.rows[0].id;
    } else {
      orgId = nanoid();
      await client.query(
        `insert into organizations (id, slug, name, description, university_id, verified, created_by)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [
          orgId,
          "prsiswa",
          "PRSISWA",
          "The official student representative council driving campus culture, sports and community life at UMS.",
          uniIds.ums,
          true,
          userId,
        ],
      );
      await client.query(
        "insert into organization_members (id, organization_id, user_id, role) values ($1,$2,$3,$4)",
        [nanoid(), orgId, userId, "owner"],
      );
    }

    const today = new Date();
    const inDays = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return d.toISOString().slice(0, 10);
    };

    const events = [
      {
        slug: "cofurun-26",
        poster: "/images/poster-run.jpg",
        name: "COFURUN'26",
        tagline: "Colour Fun Run",
        category: "Sports",
        description:
          "Get ready for the most colourful run on campus. COFURUN'26 brings together students from every faculty for a 5km fun run packed with colour powder stations, music, and prizes.\n\n### What to expect\n\n- 5km untimed fun run route around Padang Kawad\n- 4 colour powder stations\n- Finish line festival with food trucks and live DJ\n- Free event t-shirt for early bird registrants\n\n**Bring:** comfortable shoes, a change of clothes, and your best energy.",
        eventDate: inDays(21),
        startTime: "07:00",
        endTime: "11:00",
        location: "Padang Kawad, UMS",
        locationType: "physical",
        price: "RM15",
        isFree: false,
        eligibility: "Open to all UMS students",
        registrationDeadline: inDays(18),
        registrationUrl: "https://forms.gle/cofurun26-example",
        tags: "run,sports,outdoor,colour",
        status: "published",
      },
      {
        slug: "designsprint-ui-workshop",
        poster: "/images/poster-workshop.jpg",
        name: "Design Sprint: UI Foundations",
        tagline: "A hands-on product design workshop",
        category: "Workshop",
        description:
          "Learn the fundamentals of interface design in this 3-hour hands-on workshop led by working product designers. No experience necessary — just bring a laptop.\n\n### Agenda\n\n- Design thinking basics\n- Wireframing exercise\n- Rapid prototyping in Figma\n- Group critique",
        eventDate: inDays(9),
        startTime: "14:00",
        endTime: "17:00",
        location: "Innovation Hub, Level 2",
        locationType: "physical",
        price: "",
        isFree: true,
        eligibility: "Open to all students, laptop required",
        registrationDeadline: inDays(7),
        registrationUrl: "https://forms.gle/design-sprint-example",
        tags: "design,ui,workshop,tech",
        status: "published",
      },
      {
        slug: "campus-tech-career-fair",
        poster: "/images/poster-career.jpg",
        name: "Campus Tech Career Fair 2026",
        tagline: "Meet 20+ companies hiring interns and grads",
        category: "Career",
        description:
          "Connect with recruiters from leading technology companies. Bring your resume, dress smart, and be ready to make a first impression.\n\n### Participating companies\n\n- Regional banks and fintechs\n- Telco and infrastructure companies\n- Local and international startups",
        eventDate: inDays(30),
        startTime: "09:00",
        endTime: "16:00",
        location: "Dewan Canselori, UMS",
        locationType: "physical",
        price: "",
        isFree: true,
        eligibility: "Final year and penultimate students",
        registrationDeadline: inDays(27),
        registrationUrl: "https://forms.gle/career-fair-example",
        tags: "career,tech,networking",
        status: "published",
      },
      {
        slug: "volunteer-beach-cleanup",
        poster: "/images/poster-volunteer.jpg",
        name: "Coastal Cleanup Day",
        tagline: "Volunteer for a cleaner Sabah coastline",
        category: "Volunteering",
        description:
          "Join fellow students for a morning of beach cleaning at Tanjung Aru. Gloves, bags, and refreshments provided. Certificates of participation available on request.",
        eventDate: inDays(14),
        startTime: "08:00",
        endTime: "11:30",
        location: "Tanjung Aru Beach",
        locationType: "physical",
        price: "",
        isFree: true,
        eligibility: "Open to everyone",
        registrationDeadline: inDays(12),
        registrationUrl: "https://forms.gle/beach-cleanup-example",
        tags: "volunteering,environment,community",
        status: "published",
      },
      {
        slug: "ai-in-2026-panel-talk",
        poster: "/images/poster-talk.jpg",
        name: "AI in 2026: A Campus Panel Talk",
        tagline: "Industry leaders discuss where AI is heading",
        category: "Talk",
        description:
          "A panel discussion featuring alumni working in AI, product, and research. Q&A session to follow.",
        eventDate: inDays(5),
        startTime: "18:00",
        endTime: "20:00",
        location: "Auditorium B, Faculty of Computing",
        locationType: "physical",
        price: "",
        isFree: true,
        eligibility: "Open to all students",
        registrationDeadline: inDays(4),
        registrationUrl: "https://forms.gle/ai-panel-example",
        tags: "ai,technology,talk",
        status: "published",
      },
      {
        slug: "battle-of-bands-draft",
        poster: null,
        name: "Battle of the Bands",
        tagline: "Campus music competition (planning in progress)",
        category: "Competition",
        description: "Details coming soon — this event is still being planned.",
        eventDate: inDays(45),
        startTime: "19:00",
        endTime: "22:00",
        location: "Student Plaza",
        locationType: "physical",
        price: "",
        isFree: true,
        eligibility: "Open to registered bands",
        registrationDeadline: inDays(40),
        registrationUrl: "https://forms.gle/battle-bands-example",
        tags: "music,competition,arts",
        status: "draft",
      },
    ];

    for (const ev of events) {
      const existing = await client.query("select id from events where slug=$1", [ev.slug]);
      if (existing.rows[0]) continue;
      const id = nanoid();
      await client.query(
        `insert into events (
          id, slug, name, tagline, description, category, event_date, start_time, end_time,
          location, location_type, university_id, price, is_free, eligibility, registration_deadline,
          registration_url, tags, status, organization_id, owner_id, published_at, poster_url
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          id,
          ev.slug,
          ev.name,
          ev.tagline,
          ev.description,
          ev.category,
          ev.eventDate,
          ev.startTime,
          ev.endTime,
          ev.location,
          ev.locationType,
          uniIds.ums,
          ev.price,
          ev.isFree,
          ev.eligibility,
          ev.registrationDeadline,
          ev.registrationUrl,
          ev.tags,
          ev.status,
          orgId,
          userId,
          ev.status === "published" ? new Date() : null,
          ev.poster || null,
        ],
      );
    }

    console.log("Seed complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
