# 先生向け設定

## 公開の準備

1. GitHub の個人アカウントに public リポジトリ `kondakaz/zemi-quiz` を作る。
2. Settings → Pages で Source を「GitHub Actions」にする。
3. ローカルの main を push する。先に push した場合は Source の設定後、Actions の「Pages 公開」で失敗した実行の「Re-run all jobs」を押すか、「Run workflow」で main を選んで実行する。
4. Actions で「Pages 公開」が成功したことを確認し、https://kondakaz.github.io/zemi-quiz/ を開いて、回答・解説・結果まで確認する。公開の反映には時間がかかる場合がある。連続 push 時は途中の実行がキャンセルされても、最後の実行の成功を確認する。

## 招待と事前確認

1. 事前に学生の GitHub ユーザー名と、重複しない半角英小文字・数字・ハイフンのニックネームを集める。同じ名前があれば事前に別名を決める。
2. 前日までに Settings → Collaborators から招待し、学生にメールまたは GitHub の通知から承諾してもらう。招待は7日で期限切れになる。個人アカウントのリポジトリでは権限を選べず、collaborator は push・承認・マージができる。
3. 当日の冒頭に Settings → Collaborators を開き、Pending が残っていないか確認する。残っていれば本人に承諾を依頼し、期限切れなら再招待する。

## ブランチ保護とレビュー

1. 先生が test ブランチを作って push し、main 宛てに PR を作る。Actions の「問題の検査」が実行されたら PR を閉じる。
2. Settings のブランチ保護で main に PR 必須、承認1件必須、検査のジョブ `check` の合格必須を設定する。「Require branches to be up to date before merging」は外す。
3. レビュー担当は名簿の次の人などで割り当て、最後の人は最初の人を担当する。作者は自分の PR を承認できないため相互レビューが必要。欠席などで承認が付かないときは、作者でない先生が Approve すれば承認として数えられる。
4. 「自分の PR は自分でマージする」と学生に約束として伝える。GitHub の設定では作者本人だけにマージを強制できず、他の collaborator もマージできる。
5. [Issue 文面案](issues.md) を必要に応じて Issue にする。
