export default function Header({ count }) {
  return (
    <header>
      <div className="header-inner">
        <a href="/">
          <h1>Reports</h1>
        </a>
        {typeof count === 'number' && (
          <span className="count">{count > 0 ? `${count}개` : ''}</span>
        )}
        <span className="spacer" />
        <a href="/upload" className="nav-link">
          + 업로드
        </a>
        <a href="/trash" className="nav-link">
          휴지통
        </a>
      </div>
    </header>
  );
}
