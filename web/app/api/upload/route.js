import { sql } from '@/lib/db';
import { extractMeta } from '@/lib/meta';

export async function POST(request) {
  const form = await request.formData();
  const file = form.get('file');

  if (!file || typeof file === 'string') {
    return errorRedirect('파일을 선택해주세요.', request);
  }

  const date = (form.get('date') || '').toString().trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return errorRedirect('날짜를 올바르게 입력해주세요.', request);
  }

  const htmlContent = await file.text();
  const auto = extractMeta(htmlContent);
  const title =
    (form.get('title') || '').toString().trim() ||
    auto.title ||
    file.name.replace(/\.html?$/i, '');
  const description = (form.get('description') || '').toString().trim() || auto.description;

  const rows = await sql`
    INSERT INTO reports (title, description, date, html_content)
    VALUES (${title}, ${description}, ${date}, ${htmlContent})
    RETURNING id
  `;

  return Response.redirect(new URL(`/reports/${rows[0].id}`, request.url), 303);
}

function errorRedirect(message, request) {
  const url = new URL('/upload', request.url);
  url.searchParams.set('error', message);
  return Response.redirect(url, 303);
}
