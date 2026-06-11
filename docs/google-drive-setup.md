# Google Drive Entegrasyonu Kurulumu

## 1. Google Cloud Console

APIs & Services → Enable APIs:

- Google Picker API
- Google Drive API

## 2. API Key oluştur

- Credentials → Create API Key
- API Key kısıtla: HTTP referrers
  - `localhost:3030/*`
  - `yourdomain.com/*`
- `NEXT_PUBLIC_GOOGLE_API_KEY` değişkenine ekle

## 3. App ID

- Google Cloud Console → Project Settings
- Project Number'ı kopyala
- `NEXT_PUBLIC_GOOGLE_APP_ID` değişkenine ekle

## 4. OAuth Consent Screen

- Scope ekle: `https://www.googleapis.com/auth/drive.readonly`
- Test kullanıcıları ekle (development)

## 5. Authorized JavaScript Origins

- OAuth 2.0 Client ID → Edit
- Ekle: `http://localhost:3030`
- Ekle: `https://yourdomain.com`

## 6. Ortam değişkenleri

`.env.local` dosyasına ekle:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=your-api-key
NEXT_PUBLIC_GOOGLE_APP_ID=your-project-number
```

## 7. Yeniden giriş

Drive scope'u mevcut oturumlara otomatik eklenmez. Kullanıcıların çıkış yapıp tekrar Google ile giriş yapması gerekir.
