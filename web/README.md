# Claude HTML Hosting — Next.js + Vercel

업로드 페이지에서 HTML 보고서를 올리면 Postgres(Neon, Vercel Marketplace)에 저장되고,
즉시 목록/상세 페이지에서 조회되는 구조. GitHub에 push하면 Vercel이 자동으로 빌드·배포합니다.

## 구조

```
web/
├── vercel.json          # cron 설정 (10일 지난 휴지통 항목 자동 삭제)
├── schema.sql            # reports 테이블 스키마 (Postgres)
├── proxy.js              # /upload, /trash 등 관리자 라우트 Basic Auth 보호 + robots 헤더
├── lib/
│   ├── db.js              # Neon Postgres 클라이언트
│   └── meta.js            # <title>/<meta description> 자동 추출 + Basic Auth 검증
└── app/
    ├── page.js                          # 목록
    ├── reports/[id]/route.js            # 보고서 원본 HTML 서빙
    ├── upload/page.js                   # 업로드 폼
    ├── trash/page.js                    # 휴지통
    └── api/
        ├── upload/route.js
        ├── reports/[id]/delete/route.js
        ├── trash/[id]/restore/route.js
        ├── trash/[id]/purge/route.js
        └── cron/purge/route.js          # Vercel Cron이 매일 호출 (CRON_SECRET으로 보호)
```

## 환경 변수

Vercel 프로젝트(`tu-sgs-projects/web`)에 이미 설정되어 있음 (Production/Preview/Development 전체):

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | Neon Postgres 연결 문자열 (Vercel Marketplace로 자동 프로비저닝) |
| `ADMIN_USER` / `ADMIN_PASS` | `/upload`, `/trash` Basic Auth 계정 |
| `CRON_SECRET` | `/api/cron/purge`를 Vercel Cron만 호출할 수 있도록 검증 |

로컬 개발 시 `vercel env pull .env.local`로 동일한 값을 받아올 수 있음.

## 로컬 개발

```bash
npm install
vercel env pull .env.local   # 최초 1회, 또는 값이 바뀌었을 때
npm run dev                  # http://localhost:3000
```

## 배포

GitHub 저장소와 연결되어 있으면 `main` 브랜치에 push할 때마다 자동으로 프로덕션에 배포됩니다.
수동 배포:

```bash
npx vercel --prod
```

## Cron

`vercel.json`에 설정된 `0 18 * * *` (UTC, 한국시간 새벽 3시)에 `/api/cron/purge`가 호출되어
휴지통에서 10일 지난 보고서를 완전히 삭제합니다. Hobby 플랜은 cron 실행 시각이 해당 시간대 내
임의 시점에 실행될 수 있습니다.
