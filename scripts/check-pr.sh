#!/usr/bin/env bash
set -euo pipefail
# 現在のベースブランチとの共通祖先から変更を NUL 区切りで調べる。
base=$1
head=$2
mode=${3:-quiz}
ancestor=$(git merge-base "$base" "$head")
if [[ $mode == issue ]]; then
  mapfile -d '' -t changes < <(git diff --no-renames --name-status -z "$ancestor" "$head" -- questions/)
  if [[ ${#changes[@]} -eq 0 ]]; then
    echo 'questions/ に変更がないことを確認しました'
    exit 0
  fi
  message='issue- ブランチでは questions/ を変更できません'
else
  mapfile -d '' -t changes < <(git diff --no-renames --name-status -z "$ancestor" "$head")
  if [[ ${#changes[@]} -eq 2 && ${changes[0]} == A && ${changes[1]} =~ ^questions/[a-z0-9-]+\.json$ ]]; then
    echo '問題ファイル1件の追加を確認しました'
    exit 0
  fi
  message='questions/<ニックネーム>.json を1つ追加するだけにしてください'
fi
printf '%s\n' "$message"
if [[ -n ${GITHUB_ACTIONS:-} ]]; then
  printf '::error::%s\n' "$message"
fi
if [[ $mode != issue ]]; then
  echo '機能追加なら小文字の issue- で始まるブランチ名にしてください'
fi
echo '変更一覧（A: 追加、M: 変更、D: 削除）:'
for ((i=0; i+1<${#changes[@]}; i+=2)); do
  printf '  %s: %s\n' "${changes[i]}" "${changes[i+1]}"
done
exit 1
