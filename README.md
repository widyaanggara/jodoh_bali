This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Status Prototipe Netra-Hasta

Route `/netra-hasta` menjalankan kamera, MediaPipe Hand/Face Landmarker, capture
ROI `adaptive-roi-v1`, dan kandidat `dark-ridge-v1` secara lokal di browser.
Kandidat tersebut masih eksperimental: tidak semua lipatan akan ditemukan dan
kontur tangan, bayangan, atau tekstur kulit masih dapat salah terdeteksi. Hasilnya
bukan pembacaan budaya maupun prediksi ilmiah yang telah tervalidasi.

Frame, ROI, dan koordinat kandidat tidak dikirim atau disimpan otomatis. Backend
`backend/palm-analysis` tetap merupakan eksperimen terpisah dengan
`analysis_enabled=false`; frontend tidak mengunggah ROI dan tidak memakai Python
sebagai fallback. Eksperimen pretrained ONNX juga masih **HOLD** dan hanya untuk
diagnostik offline.

Kerangka FastAPI sudah tersedia, tetapi persyaratan analisis melalui FastAPI belum
terpenuhi secara end-to-end. Integrasi kelak memerlukan persetujuan eksplisit,
kanal aman, kebijakan retensi, kontrak error/abstain, benchmark yang disetujui,
dan revisi kebijakan privasi. Prototipe ini tidak berstatus production-ready.
