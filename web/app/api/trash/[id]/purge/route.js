import { sql } from '@/lib/db';

export async function POST(request, ctx) {
  const { id } = await ctx.params;
  if (/^\d+$/.test(id)) {
    await sql`DELETE FROM reports WHERE id = ${id} AND deleted_at IS NOT NULL`;
  }
  return Response.redirect(new URL('/trash', request.url), 303);
}
