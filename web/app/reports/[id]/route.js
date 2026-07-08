import { sql } from '@/lib/db';

export async function GET(request, ctx) {
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) {
    return new Response('보고서를 찾을 수 없습니다.', { status: 404 });
  }
  const rows = await sql`
    SELECT html_content FROM reports WHERE id = ${id} AND deleted_at IS NULL
  `;
  if (rows.length === 0) {
    return new Response('보고서를 찾을 수 없습니다.', { status: 404 });
  }
  return new Response(rows[0].html_content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
