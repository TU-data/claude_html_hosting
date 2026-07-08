import { sql } from '@/lib/db';

export async function POST(request, ctx) {
  const { id } = await ctx.params;
  if (/^\d+$/.test(id)) {
    await sql`UPDATE reports SET deleted_at = now() WHERE id = ${id} AND deleted_at IS NULL`;
  }
  return Response.redirect(new URL('/', request.url), 303);
}
