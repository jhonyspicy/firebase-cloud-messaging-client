import { useState, useEffect } from 'react'
import './App.css'
import { requestNotificationPermission, onMessageListener } from './firebase'

interface Message {
  title: string;
  body: string;
  timestamp: Date;
}

interface FCMPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string>;
}

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Send Firebase config to service worker
          const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
          };
          
          if (registration.active) {
            registration.active.postMessage({
              type: 'INIT_FIREBASE',
              config: firebaseConfig
            });
          }
        })
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    // Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log('Received foreground message:', payload);
        const fcmPayload = payload as FCMPayload;
        const newMessage: Message = {
          title: fcmPayload.notification?.title || 'New Message',
          body: fcmPayload.notification?.body || '',
          timestamp: new Date(),
        };
        setMessages((prev) => [newMessage, ...prev]);
      })
      .catch((err) => console.error('Failed to receive message:', err));
  }, []);

  const handleGetToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
      } else {
        setError('Failed to get FCM token. Please check your Firebase configuration and notification permissions.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    }
  };
  
  onMessageListener().then((payload) => {
     // console.log(payload);
     const title = payload.notification?.title || 'New Message';
     const body = payload.notification?.body || 'You have a new message';
     setMessages(prev => [...prev, {title, body}]);
  });

  return (
    <div className="app-container">
      <h1>Firebase Cloud Messaging Client</h1>
      <p className="subtitle">FCMの動作確認用クライアントアプリ</p>

      <div className="section">
        <h2>1. FCM Token取得</h2>
        <button 
          onClick={handleGetToken} 
          disabled={loading || !!token}
          className="primary-button"
        >
          {loading ? 'Loading...' : token ? 'Token取得済み' : 'FCM Token取得'}
        </button>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {token && (
          <div className="token-container">
            <h3>取得したFCM Token:</h3>
            <div className="token-display">
              <code>{token}</code>
              <button onClick={copyTokenToClipboard} className="copy-button">
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <h2>2. 受信したメッセージ</h2>
        {messages.length === 0 ? (
          <p className="no-messages">メッセージがまだありません</p>
        ) : (
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className="message-card">
                <div className="message-header">
                  <strong>{message.title}</strong>
                </div>
                <div className="message-body">{message.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section config-info">
        <h3>環境変数設定状況</h3>
        <ul>
          <li>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ 設定済み' : '❌ 未設定'}</li>
          <li>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ 設定済み' : '❌ 未設定'}</li>
          <li>Messaging Sender ID: {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ 設定済み' : '❌ 未設定'}</li>
          <li>VAPID Key: {import.meta.env.VITE_FIREBASE_VAPID_KEY ? '✅ 設定済み' : '❌ 未設定'}</li>
        </ul>
      </div>
    </div>
  )
}

export default App
