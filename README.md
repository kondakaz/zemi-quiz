# ゼミクイズ

サイト: https://kondakaz.github.io/zemi-quiz/

## 参加の流れ

1. リポジトリを clone する。
2. `add-quiz-<nickname>` ブランチを作る。
3. `questions/_template.json` を `questions/<nickname>.json` にコピーし、問題を書く。ファイル名は半角英小文字・数字・ハイフンを使い、本名や学籍番号は書かない。答えは 0〜3 の番号。
4. commit して push し、GitHub で PR を作る。
5. 自分の PR を出したら、先生が前日までに配る名簿の次の人の PR をすぐに見る。最後の人は最初の人を見て、欠席者は飛ばす。次の人の PR がまだなければ、さらに次の人以降の PR から Approve の付いていないものを1つ見る。
6. 内容を確認して問題がなければ Approve し、修正が必要ならコメントする。自分の PR に5分たっても Approve が付かなければ先生に声をかけ、先生に Approve してもらう。承認が付き、検査が緑になったら自分でマージする。
7. 1〜2分後にサイトで問題を解き、main に戻って pull する。

詳しい手順は[講座の手順書（Markdown）](docs/handout.md)を参照してください。公開サイトでは[手順書（HTML）](https://kondakaz.github.io/zemi-quiz/docs/handout.html)も読めます。先生向けの設定は [teacher-setup.md](docs/teacher-setup.md) を参照。

Issue の機能追加には `issue-<番号>-<短い名前>` ブランチを使います。この接頭辞のブランチでは、問題ファイル1件だけの差分検査を省略しますが、questions/ の変更は禁止です。

## 研究室サイトとの関係

演習はこのリポジトリで行います。研究室サイトからリンクするか、ビルド済みの `_site/` の中身を研究室サイトの `zemi/quiz/` にコピーします。学生に研究室サイトの権限を渡す必要はありません。画面の GitHub リポジトリへのリンクは、移設可能な相対パスの例外として絶対 URL を使っています。
<!-- 試験 -->
