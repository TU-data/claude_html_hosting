#!/usr/bin/env python3
"""
보고서 하나를 reports.json에 추가/갱신합니다.

사용법:
  python3 scripts/add_report.py reports/2026-06-02/my-report.html
  python3 scripts/add_report.py reports/2026-06-02/my-report.html --title "제목" --desc "설명"
"""

import sys
import json
import os
import re
import argparse
from datetime import datetime


def extract_meta(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    title_match = re.search(r'<title[^>]*>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else os.path.splitext(os.path.basename(filepath))[0]

    # <meta name="description" content="..."> (순서 무관)
    desc_match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        content, re.IGNORECASE
    )
    if not desc_match:
        desc_match = re.search(
            r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']',
            content, re.IGNORECASE
        )
    description = desc_match.group(1).strip() if desc_match else ''

    return title, description


def extract_date_from_path(path):
    for part in path.replace('\\', '/').split('/'):
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', part):
            return part
    return datetime.now().strftime('%Y-%m-%d')


def main():
    parser = argparse.ArgumentParser(description='보고서를 reports.json에 추가합니다')
    parser.add_argument('path', help='HTML 파일 경로 (예: reports/2026-06-02/report.html)')
    parser.add_argument('--title', help='제목 직접 지정 (생략 시 <title> 태그에서 추출)')
    parser.add_argument('--desc', help='설명 직접 지정 (생략 시 <meta description>에서 추출)')
    args = parser.parse_args()

    html_path = args.path.replace('\\', '/').lstrip('./')
    # repo root 기준 경로로 정규화
    if html_path.startswith('/'):
        # 절대 경로면 reports/ 이하만 취함
        idx = html_path.find('reports/')
        if idx != -1:
            html_path = html_path[idx:]

    if not os.path.exists(html_path):
        print(f'오류: 파일을 찾을 수 없습니다 — {html_path}')
        sys.exit(1)

    auto_title, auto_desc = extract_meta(html_path)
    title = args.title or auto_title
    description = args.desc or auto_desc
    date = extract_date_from_path(html_path)

    manifest = 'reports.json'
    reports = []
    if os.path.exists(manifest):
        with open(manifest, 'r', encoding='utf-8') as f:
            reports = json.load(f)

    existing = next((r for r in reports if r['path'] == html_path), None)
    if existing:
        existing['title'] = title
        existing['description'] = description
        existing['date'] = date
        action = '갱신'
    else:
        reports.append({'date': date, 'title': title, 'description': description, 'path': html_path})
        action = '추가'

    reports.sort(key=lambda x: x['date'], reverse=True)

    with open(manifest, 'w', encoding='utf-8') as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)

    print(f'[{action}] {title}')
    print(f'  날짜: {date}')
    print(f'  경로: {html_path}')
    print(f'  설명: {description or "(없음)"}')
    print(f'reports.json 업데이트 완료 ({len(reports)}개)')


if __name__ == '__main__':
    main()
