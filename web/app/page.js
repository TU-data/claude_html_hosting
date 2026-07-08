import { sql } from '@/lib/db';
import Header from './components/Header';
import DeleteForm from './components/DeleteForm';

export const dynamic = 'force-dynamic';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC',
  });
}

export default async function HomePage() {
  const reports = await sql`
    SELECT id, title, description, to_char(date, 'YYYY-MM-DD') AS date
    FROM reports
    WHERE deleted_at IS NULL
    ORDER BY date DESC, id DESC
  `;

  const groups = {};
  for (const r of reports) {
    if (!groups[r.date]) groups[r.date] = [];
    groups[r.date].push(r);
  }
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Header count={reports.length} />
      <main>
        {reports.length === 0 ? (
          <div className="empty-state">
            <h2>등록된 보고서가 없습니다</h2>
            <a href="/upload" className="nav-link" style={{ color: '#52525b', borderColor: '#d4d4d8' }}>
              보고서 업로드하기
            </a>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div className="date-group" key={date}>
              <div className="date-label">{formatDate(date)}</div>
              {groups[date].map((r) => (
                <div className="report-row" key={r.id}>
                  <a href={`/reports/${r.id}`} className="report-link">
                    <div className="card-title">{r.title}</div>
                    {r.description && <div className="card-desc">{r.description}</div>}
                  </a>
                  <DeleteForm
                    action={`/api/reports/${r.id}/delete`}
                    confirmText="휴지통으로 이동합니다. 10일 후 완전히 삭제됩니다. 계속할까요?"
                    label="삭제"
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </main>
    </>
  );
}
