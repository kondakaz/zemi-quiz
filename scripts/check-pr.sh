#!/usr/bin/env bash
set -euo pipefail
# 現在のベースブランチとの共通祖先から変更を NUL 区切りで調べる。
base=$1
head=$2
ancestor=$(git merge-base "$base" "$head")
mapfile -d '' -t changes < <(git diff --no-renames --name-status -z "$ancestor" "$head")
if [[ ${#changes[@]} -ne 2 || ${changes[0]} != A || ! ${changes[1]} =~ ^questions/[a-z0-9-]+\.json$ ]]; then
  echo 'エラー: questions/<ニックネーム>.json を1つ追加するだけにしてください'
  echo '変更一覧（A: 追加、M: 変更、D: 削除）:'
  for ((i=0; i+1<${#changes[@]}; i+=2)); do
    printf '  %s: %q\n' "${changes[i]}" "${changes[i+1]}"
  done
  if [[ -n ${GITHUB_ACTIONS:-} ]]; then
    echo '::error::変更一覧を確認し、問題ファイル1つの追加だけにしてください'
  fi
  exit 1
fi
echo '問題ファイル1件の追加を確認しました'
