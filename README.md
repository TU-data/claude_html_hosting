# Claude Report Hosting

클로드에서 생성한 HTML 보고서를 GitHub Pages로 호스팅하는 포털.

## 폴더 구조

```
/
├── index.html          # 보고서 목록 메인 페이지
├── reports.json        # 보고서 메타데이터 목록
├── reports/
│   ├── 2026-06-02/
│   │   └── report.html
│   └── 2026-06-01/
│       └── another.html
└── scripts/
    ├── add_report.py   # 보고서 한 개 추가
    └── scan_all.py     # reports/ 전체 스캔하여 재생성
```

## 워크플로우

### 보고서 추가 (단건)

1. HTML 파일을 날짜 폴더에 저장
   ```
   reports/2026-06-02/market-analysis.html
   ```

2. manifest 업데이트
   ```bash
   python3 scripts/add_report.py reports/2026-06-02/market-analysis.html
   ```
   제목/설명을 직접 지정하려면:
   ```bash
   python3 scripts/add_report.py reports/2026-06-02/market-analysis.html \
     --title "Q2 시장 분석" \
     --desc "2분기 국내외 시장 동향 및 경쟁사 분석"
   ```

3. 커밋 & 푸시
   ```bash
   git add .
   git commit -m "add: Q2 시장 분석 보고서"
   git push
   ```

### 보고서 대량 추가

reports/ 폴더에 HTML 파일들을 넣은 뒤:
```bash
python3 scripts/scan_all.py
git add .
git commit -m "add: 보고서 일괄 추가"
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
