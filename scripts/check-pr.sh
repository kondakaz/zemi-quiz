#!/usr/bin/env bash
set -euo pipefail
# 現在のベースブランチとの共通祖先から変更を NUL 区切りで調べる。
base=$1
head=$2
mode=${3:-quiz}
ancestor=$(git merge-base "$base" "$head")
diff_file=$(mktemp)
trap 'rm -f "$diff_file"' EXIT
if [[ $mode == issue ]]; then
  if ! git diff --no-renames --name-status -z "$ancestor" "$head" -- questions/ > "$diff_file"; then
    echo 'エラー: questions/ の差分を取得できませんでした'
    exit 1
  fi
  mapfile -d '' -t changes < "$diff_file"
  if [[ ${#changes[@]} -eq 0 ]]; then
    echo 'questions/ に変更がないことを確認しました'
    exit 0
  fi
  message='issue- ブランチでは questions/ を変更できません'
else
  if ! git diff --no-renames --name-status -z "$ancestor" "$head" > "$diff_file"; then
    echo 'エラー: PR の差分を取得できませんでした'
    exit 1
  fi
  mapfile -d '' -t changes < "$diff_file"
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
  has_question_addition=false
  for ((i=0; i+1<${#changes[@]}; i+=2)); do
    if [[ ${changes[i]} == A && ${changes[i+1]} == questions/* ]]; then
      has_question_addition=true
    fi
  done
  if [[ $has_question_addition == false ]]; then
    echo '機能追加なら小文字の issue- で始まるブランチ名にしてください'
  fi
fi
echo '変更一覧（A: 追加、M: 変更、D: 削除）:'
for ((i=0; i+1<${#changes[@]}; i+=2)); do
  printf '  %s: %s\n' "${changes[i]}" "${changes[i+1]}"
done
exit 1
