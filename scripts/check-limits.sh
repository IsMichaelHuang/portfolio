#!/usr/bin/env bash
# Fails if a tracked file exceeds 400 lines or 80 characters per line.
# Usage: check-limits.sh [dir]   (default: repo root)
# Exempt: package-lock.json, public/*, src/data/projects.ts (generated),
# and SHA-pinned "uses:" lines, which cannot wrap and must keep the
# "owner/action@sha # vX.Y.Z" shape Dependabot rewrites.
cd "${1:-$(dirname "$0")/..}" || exit 2
bad=0
while IFS= read -r f; do
  case "$f" in
    package-lock.json | public/* | src/data/projects.ts) continue ;;
  esac
  [ -f "$f" ] || continue
  # Strip UTF-8 continuation bytes so length counts characters, not bytes.
  out=$(LC_ALL=C awk -v f="$f" '
    { s = $0; gsub(/[\200-\277]/, "", s) }
    /uses: [^ ]+@[0-9a-f]+ # v[0-9.]+$/ { next }
    length(s) > 80 { print "WIDE " f ":" NR }
    END { if (NR > 400) print "LONG " f " (" NR ")" }
  ' "$f")
  if [ -n "$out" ]; then
    printf '%s\n' "$out"
    bad=1
  fi
done < <(git -c core.quotepath=off ls-files)
exit "$bad"
