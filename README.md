# Code Memo

これまで作ったものを、画面の画像とタイトルで一覧にまとめたサイト。タップすると詳しく見られます。

**公開サイト: https://kyosuke0306.github.io/code_memo/**

## 作品の追加・削除

`works.js` の配列を編集するだけです。

- 画面画像は `img/<id>.webp`（なければ `placeholder` の文字で表示）
- `url` があれば「開く」ボタン、`repo` があれば GitHub ボタンを表示（`private: true` ならリンクしない）
- `video` を書くと詳細画面で動画を再生
- `period` は制作期間（最初と最後のコミット日）、`cost` は API 費用（`yen` 円・`approx` 推定・`plus` 以上・`note` 内訳）。費用がわからない作品は書かなければ「記録なし」と表示

ビルド不要の静的サイト（HTML / CSS / JS）。`index.html` をブラウザで開けば手元でも確認できます。

## 公開

GitHub Pages の **Deploy from a branch**（`main` / `/ (root)`）で公開しています。`main` に push すると1〜2分で反映されます。
