# 先生向け設定

1. GitHub に public リポジトリ `kondakaz/zemi-quiz` を作成し、ローカルの main を push する。
2. 学生を Write 権限の collaborator として招待する。
3. Settings → Pages の Source を GitHub Actions にする。
4. main のブランチ保護で PR 必須、承認1件必須、問題の検査の合格必須を設定する。検査のジョブ名は `check`（ワークフロー名は「問題の検査」）である。PR で一度実行してから、必須チェックに `check` を選ぶ。作者は自分の PR を承認できないため、学生同士の相互レビューが必要になる。
5. [Issue 文面案](issues.md) を必要に応じて Issue にする。

レビュー担当は名簿の次の人などの規則で割り当て、最後の人は最初の人を担当する。

## 公開の確認

main への push 後、Actions タブで「Pages 公開」が成功したことを確認する。続いて https://kondakaz.github.io/zemi-quiz/ を開き、問題を回答して結果まで表示されることを確認する。反映まで1〜2分かかる場合がある。
