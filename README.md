# DocShift — Document to Data Conversion

> Excel, Word, PDF ve PowerPoint dosyalarını JSON, XML,
> Markdown veya düz metne dönüştüren web uygulaması.

## Özellikler

- 4 dosya formatı desteği: Excel, Word, PDF, PowerPoint
- 4 çıktı formatı: JSON, XML, Markdown, Plain Text
- Çoklu dosya yükleme
- Dönüşüm geçmişi (üye/anonim)
- Google OAuth ile giriş
- Docker ile çalıştırma (dev/prod)

## Kurulum

### Gereksinimler

- Node.js 20+
- Docker + Docker Compose

### Dev ortamı

```bash
cp .env.example .env.local
# .env.local dosyasını doldur
docker compose -f docker-compose-dev.yml up --build
# http://localhost:3030
```

### Prod ortamı

```bash
cp .env.example .env.production
# .env.production dosyasını doldur
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
# http://localhost:3031
```

## Env Variables

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı string |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `AUTH_SECRET` | NextAuth secret (alternatif; `NEXTAUTH_SECRET` ile aynı değer) |
| `NEXTAUTH_URL` | Uygulama URL'i |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- NextAuth.js v5
- PostgreSQL + pg
- Docker Compose
- Jest

## Geliştirme Süreci

Her yeni özellik için GitHub Issue açılır,
issue'daki Cursor prompt'u IDE'ye uygulanır,
commit mesajı issue numarasını içerir: `feat: #1 chained conversion`
