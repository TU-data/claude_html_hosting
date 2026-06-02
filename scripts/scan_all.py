#!/usr/bin/env python3
"""
reports/ 폴더를 전체 스캔하여 reports.json을 재생성합니다.
기존 reports.json의 수동 편집 내용(title, description)을 보존합니다.

사용법:
  python3 scripts/scan_all.py
  python3 scripts/scan_all.py --overwrite   # 기존 메타 무시하고 HTML에서 전부 재추출
"""

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
    parser = argparse.ArgumentParser(description='reports/ 폴더 전체 스캔')
    parser.add_argument('--overwrite', action='store_true', help='기존 메타 무시하고 HTML에서 재추출')
    args = parser.parse_args()

    manifest = 'reports.json'

    # 기존 데이터 로드 (보존용)
    existing_map = {}
    if os.path.exists(manifest) and not args.overwrite:
        with open(manifest, 'r', encoding='utf-8') as f:
            for r in json.load(f):
                existing_map[r['path']] = r

    found = []
    reports_dir = 'reports'

    if not os.path.isdir(reports_dir):
        print(f'reports/ 폴더가 없습니다. 먼저 생성하세요.')
        return

    for root, dirs, files in os.walk(reports_dir):
        dirs.sort()
        for fname in sorted(files):
            if not fname.lower().endswith('.html'):
                continue
            rel_path = os.path.join(root, fname).replace('\\', '/')
            date = extract_date_from_path(rel_path)

            if rel_path in existing_map and not args.overwrite:
                # 경로/날짜만 최신화, 제목·설명은 보존
                entry = dict(existing_map[rel_path])
                entry['date'] = date
            else:
                title, description = extract_meta(rel_path)
                entry = {'date': date, 'title': title, 'description': description, 'path': rel_path}

            found.append(entry)
            print(f'  {rel_path}  →  {entry["title"]}')

    found.sort(key=lambda x: x['date'], reverse=True)

    with open(manifest, 'w', encoding='utf-8') as f:
        json.dump(found, f, ensure_ascii=False, indent=2)

    print(f'\nreports.json 재생성 완료 ({len(found)}개)')


if __name__ == '__main__':
    main()
