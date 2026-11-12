#!/usr/bin/env bash
set -euo pipefail
# PR の共通祖先から head までの変更を NUL 区切りで調べる。
base=$1
head=$2
ancestor=$(git merge-base "$base" "$head")
mapfile -d '' -t changes < <(git diff --no-renames --name-status -z "$ancestor" "$head")
if [[ ${#changes[@]} -ne 2 || ${changes[0]} != A || ! ${changes[1]} =~ ^questions/[a-z0-9-]+\.json$ ]]; then
  echo '::error::questions/<ニックネーム>.json を1つ追加するだけにしてください'
  exit 1
fi
echo '問題ファイル1件の追加を確認しました'
