# firebase-cloud-messaging-client

サーバー側でFCMを実装する際に、動作を確認するためだけのクライアントです。トークンを取得してメッセージを表示するだけです。

## 機能

1. ✅ FCMのapiKeyなどを環境変数で設定可能
2. ✅ FCMからトークンを取得して画面に表示
3. ✅ サーバーから送信されたメッセージを受信
4. ✅ 受信したメッセージを画面に表示

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、Firebaseの設定値を入力してください：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、Firebaseプロジェクトの設定を入力：

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

**Firebase設定値の取得方法:**
1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択または作成
3. プロジェクト設定 → 一般 → マイアプリ → SDK の設定と構成でFirebaseConfigを確認
4. Cloud Messaging → ウェブプッシュ証明書でVAPID Keyを取得

### 3. アプリケーションの起動

開発サーバーを起動：

```bash
npm run dev
```

ブラウザで http://localhost:5173 にアクセス

## 使い方

1. **FCM Token取得**: 「FCM Token取得」ボタンをクリックして通知許可を求められたら許可する
2. **Tokenのコピー**: 取得したTokenをコピーしてサーバー側で使用
3. **メッセージ送信**: サーバー側から取得したTokenに向けてメッセージを送信
4. **メッセージ確認**: 画面上部に受信したメッセージが表示される

## ビルド

プロダクションビルド：

```bash
npm run build
```

ビルドしたアプリのプレビュー：

```bash
npm run preview
```

## 技術スタック

- React 19
- TypeScript
- Vite
- Firebase SDK (Cloud Messaging)

## ライセンス

MIT
