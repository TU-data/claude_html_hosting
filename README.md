# Claude Report Hosting

클로드에서 생성한 HTML 보고서를 GitHub Pages로 호스팅하는 포털.

## 폴더 구조

```
/
├── .github/workflows/
│   └── update-reports.yml  # reports.json 자동 갱신 워크플로우
├── index.html              # 보고서 목록 메인 페이지
├── reports.json            # 보고서 메타데이터 목록 (자동 생성)
├── reports/
│   ├── 2026-06-02/
│   │   └── report.html
│   └── 2026-06-01/
│       └── another.html
└── scripts/
    ├── add_report.py       # 보고서 한 개 추가 (로컬용)
    └── scan_all.py         # reports/ 전체 스캔하여 재생성
```

## 워크플로우

### 보고서 추가 (자동, 권장)

HTML 파일을 날짜 폴더에 저장하고 push하면 `reports.json`이 자동으로 갱신됩니다.

```bash
# 1. HTML 파일 저장
reports/2026-06-02/market-analysis.html

# 2. 커밋 & 푸시 (reports.json은 자동 갱신됨)
git add reports/2026-06-02/market-analysis.html
git commit -m "add: Q2 시장 분석 보고서"
git push
```

push 후 GitHub Actions가 `scan_all.py`를 실행하여 `reports.json`을 갱신하고 자동 커밋합니다.

### 보고서 추가 (수동, 로컬)

자동화 없이 로컬에서 직접 갱신하려면:

```bash
# 단건 추가
python3 scripts/add_report.py reports/2026-06-02/market-analysis.html

# 전체 재스캔
python3 scripts/scan_all.py

git add .
git commit -m "add: 보고서 추가"
git push
```

## GitHub Pages 설정

1. 저장소 Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. 저장 후 배포 URL 확인

## 메타 자동 추출

`add_report.py`와 `scan_all.py`는 HTML 파일에서 자동 추출합니다:
- **제목**: `<title>` 태그
- **설명**: `<meta name="description" content="...">` 태그
