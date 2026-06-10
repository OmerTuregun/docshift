# @docshift/sdk

DocShift REST API için resmi TypeScript istemcisi.

## Kurulum

```bash
npm install @docshift/sdk
```

Monorepo içinden yerel test:

```bash
npm install file:./packages/docshift-sdk
```

## Kullanım

```typescript
import { DocShift } from "@docshift/sdk";

const client = new DocShift({
  apiKey: "ds_live_...",
  baseUrl: "https://yourdomain.com",
});

const result = await client.convert({
  file: "./document.xlsx",
  outputFormat: "json",
});

console.log(result.converted);
```

## Geliştirme

```bash
cd packages/docshift-sdk
npm install
npm run build
```
