# 先生向け設定

## 公開の準備

1. GitHub の個人アカウントに public リポジトリ `kondakaz/zemi-quiz` を作る。
2. Settings → Pages で Source を「GitHub Actions」にする。
3. ローカルの main を push する。先に push した場合は Source の設定後、Actions の「Pages 公開」で失敗した実行の「Re-run all jobs」を押すか、「Run workflow」で main を選んで実行する。
4. Actions で「Pages 公開」が成功したことを確認し、https://kondakaz.github.io/zemi-quiz/ を開いて、回答・解説・結果まで確認する。公開の反映には時間がかかる場合がある。連続 push 時は途中の実行がキャンセルされても、最後の実行の成功を確認する。

## 試験 PR

1. 先生が main から `issue-0-test` ブランチを作り、README に試験用の1行を追加して commit・push する。`issue-` で始まるブランチでは画面や文書の変更ができるが、questions/ の変更はできない。
2. main 宛ての PR を作り、Actions の「問題の検査」の `check` が成功することを確かめる。
3. PR をマージせずに閉じ、試験ブランチを削除する。

## ブランチ保護

Settings → Branches の「Add classic branch protection rule」で main のルールを作り、PR 必須、承認1件必須、検査のジョブ `check` の合格必須を設定する。「Require branches to be up to date before merging」は外す。

## 招待前の通し確認

先生と別アカウント1つで、`add-quiz-<試験名>` ブランチに「先生の2問目」として公開後も残せる問題を1件追加し、PR → check → Approve → 作者マージ → Pages 反映を確認する。PR 作成後、別アカウントが `add-quiz-<試験名2>` ブランチで公開後も残してよい問題を1件追加し、PR を作る。先生がその PR を Approve してマージし、main を進める。Settings → General → Pull Requests の「Always suggest updating pull request branches」を有効にしてから、試験 PR で Update branch を実行しても check が緑になることを確認し、マージする。別アカウントには、この確認のため事前にアクセスを用意する。

## 招待と準備

1. 事前に学生の GitHub ユーザー名と、重複しない半角英小文字・数字・ハイフンのニックネームを集める。同じ名前があれば事前に別名を決める。
2. 前日までに Settings → Collaborators から招待し、学生にメールまたは GitHub の通知から承諾してもらう。招待は7日で期限切れになる。個人アカウントのリポジトリでは権限を選べず、collaborator は push・承認・マージができる。
3. 前日にも Settings → Collaborators で Pending が残っていないか確認し、承諾を依頼する。
4. 前日までにレビュー順の名簿を配る。個人名はこの資料に書かない。各自は名簿の次の人の PR を見て、最後の人は最初の人を見る。欠席者は飛ばす。
5. [Issue 文面案](issues.md) を必要に応じて Issue にする。機能追加のブランチは `issue-<番号>-<短い名前>` とする。

## 当日の確認と対処

- 冒頭に Settings → Collaborators を開き、Pending が残っていないか確認する。残っていれば本人に承諾を依頼し、期限切れなら再招待する。
- 各自は自分の PR を出したら、すぐ名簿の次の人の PR を見に行く。まだ出ていなければ、さらに次の人以降の PR から Approve の付いていないものを1つ見るよう案内する。
- 作者は自分の PR を承認できない。5分たっても自分の PR に Approve が付かなければ先生に声をかけてもらい、先生が Approve する。欠席者は名簿から飛ばす。
- 学生が誤って Request changes を付けた場合は、本人に再レビューで Approve してもらうか、先生がそのレビューを dismiss する。
- 「自分の PR は自分でマージする」と学生に約束として伝える。GitHub の設定では作者本人だけにマージを強制できず、他の collaborator もマージできる。
