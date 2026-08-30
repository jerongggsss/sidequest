import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const demoUser = await client.query("SELECT id, name, university_id FROM users WHERE email = 'demo@sidequest.my'");
    const demo = demoUser.rows[0];
    
    if (!demo) {
      console.log("Demo user not found");
      return;
    }

    const org = await client.query("SELECT id, name, created_by, university_id, verified FROM organizations WHERE slug = 'sidequest'");
    const sidequest = org.rows[0];

    const members = await client.query("SELECT user_id, role FROM organization_members WHERE organization_id = $1", [sidequest.id]);
    
    const events = await client.query("SELECT id, slug, name, status, owner_id, organization_id FROM events WHERE organization_id = $1", [sidequest.id]);

    const otherRefs = await client.query("SELECT id, event_id FROM saved_events WHERE user_id = $1", [demo.id]);

    console.log(JSON.stringify({
      demoUser: demo,
      sidequestOrg: sidequest,
      orgMembers: members.rows,
      events: events.rows,
      savedEventsCount: otherRefs.rowCount
    }, null, 2));

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
