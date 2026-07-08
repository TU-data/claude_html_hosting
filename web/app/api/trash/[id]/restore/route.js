import { sql } from '@/lib/db';

export async function POST(request, ctx) {
  const { id } = await ctx.params;
  if (/^\d+$/.test(id)) {
    await sql`UPDATE reports SET deleted_at = NULL WHERE id = ${id}`;
  }
  return Response.redirect(new URL('/trash', request.url), 303);
}
