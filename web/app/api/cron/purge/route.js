import { sql } from '@/lib/db';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await sql`
    DELETE FROM reports
    WHERE deleted_at IS NOT NULL AND deleted_at <= now() - interval '10 days'
    RETURNING id
  `;

  return Response.json({ success: true, purged: result.length });
}
