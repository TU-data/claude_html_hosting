# Claude Report Hosting

클로드에서 생성한 HTML 보고서를 업로드·조회하는 내부 포털. Next.js 앱을 Vercel에 배포하고,
보고서는 Postgres(Neon)에 저장한다. 자세한 내용은 [web/README.md](web/README.md) 참고.

앱 코드는 전부 [`web/`](web) 폴더 안에 있고, `main` 브랜치에 push하면 Vercel이 자동으로
빌드·배포한다.

> 이전에는 GitHub Pages + git commit 기반으로 정적 호스팅했으나, 웹 업로드 화면에서 바로
> 반영되는 구조로 전환했다.
