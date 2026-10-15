# Code Memo

これまで作ったものを、画面の画像とタイトルで一覧にまとめたサイト。タップすると詳しく見られます。

**公開サイト: https://kyosuke0306.github.io/code_memo/**

## 作品の追加・削除

`works.js` の配列を編集するだけです。

- 画面画像は `img/<id>.webp`（なければ `placeholder` の文字で表示）
- `url` があれば「開く」ボタン、`repo` があれば GitHub ボタンを表示（`private: true` ならリンクしない）
- `video` を書くと詳細画面で動画を再生

ビルド不要の静的サイト（HTML / CSS / JS）。`index.html` をブラウザで開けば手元でも確認できます。

## デプロイ

`main` に push すると GitHub Actions で GitHub Pages に自動デプロイされます。
初回のみ **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にしてください。
