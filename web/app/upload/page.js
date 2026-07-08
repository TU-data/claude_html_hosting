import Header from '../components/Header';

export default async function UploadPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <>
      <Header />
      <main className="narrow">
        {error && <div className="message error">{error}</div>}
        <div className="card">
          <form method="POST" action="/api/upload" encType="multipart/form-data">
            <label>HTML 파일</label>
            <input type="file" name="file" accept=".html,text/html" required />

            <label>제목 (비워두면 &lt;title&gt; 태그에서 자동 추출)</label>
            <input type="text" name="title" placeholder="자동 추출" />

            <label>설명 (비워두면 meta description에서 자동 추출)</label>
            <input type="text" name="description" placeholder="자동 추출" />

            <label>날짜</label>
            <input type="date" name="date" required defaultValue={new Date().toISOString().slice(0, 10)} />

            <button type="submit">업로드</button>
          </form>
        </div>
      </main>
    </>
  );
}
