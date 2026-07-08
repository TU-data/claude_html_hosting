import { sql } from '@/lib/db';
import Header from '../components/Header';
import DeleteForm from '../components/DeleteForm';

export const dynamic = 'force-dynamic';

const RETENTION_DAYS = 10;

function daysRemaining(deletedAt) {
  const elapsedMs = Date.now() - new Date(deletedAt).getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(RETENTION_DAYS - elapsedDays));
}

export default async function TrashPage() {
  const items = await sql`
    SELECT id, title, description, deleted_at
    FROM reports
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `;

  return (
    <>
      <Header />
      <main>
        {items.length === 0 ? (
          <div className="empty-state">
            <h2>휴지통이 비어 있습니다</h2>
          </div>
        ) : (
          items.map((r) => (
            <div className="report-row" key={r.id}>
              <div className="report-link">
                <div className="card-title">{r.title}</div>
                <div className="card-desc">
                  삭제일: {new Date(r.deleted_at).toISOString().slice(0, 19).replace('T', ' ')} ·{' '}
                  {daysRemaining(r.deleted_at)}일 후 완전 삭제
                </div>
              </div>
              <form method="POST" action={`/api/trash/${r.id}/restore`}>
                <button type="submit" className="restore-btn">
                  복원
                </button>
              </form>
              <DeleteForm
                action={`/api/trash/${r.id}/purge`}
                confirmText="완전히 삭제합니다. 복구할 수 없습니다. 계속할까요?"
                label="영구 삭제"
              />
            </div>
          ))
        )}
      </main>
    </>
  );
}
