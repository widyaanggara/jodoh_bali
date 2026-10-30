# Skema Label Rekha Visual

Format: `metemu-palm-lines` versi 3. Protokol: `rekha-visual-v1`.

## Perubahan dari JSON v2

Versi 3 menambahkan metadata semantik visual tanpa mengubah koordinat ROI:

- `roi_pixel_sha256`;
- `handedness`;
- `reference_ids`;
- `annotator_id` anonim;
- `protocol_version`;
- `class_states` untuk menyimpan absent/undetermined tanpa polyline kosong;
- metadata `visual_class`, `label_status`, `visibility`, dan `truncated` pada
  setiap polyline.

JSON v1/v2 tetap dapat diimpor. Polyline historis v2 dibaca sebagai
`visual_class=unknown`, `label_status=ambiguous`, dan `visibility=visible`.
Empat `class_states` menjadi `undetermined`. Migrasi ini tidak mengarang kelas.

## Enum

```text
visual_class = life | head | heart | fate | other | unknown
label_status = provisional | verified | ambiguous
visibility   = visible | obscured | absent | undetermined
handedness   = left | right | unknown
```

Polyline hanya boleh memakai `visible` atau `obscured`. Status `absent` dan
`undetermined` disimpan pada `class_states`.

## Contoh minimal versi 3

```json
{
  "format": "metemu-palm-lines",
  "version": 3,
  "samples": [
    {
      "sample_id": "palm-a1b2c3d4e5f6",
      "sample_fingerprint": "<sha256 sumber>",
      "roi_signature": "roi-...",
      "roi_pixel_sha256": "<sha256 RGBA ROI>",
      "roi_width": 1039,
      "roi_height": 1425,
      "roi_algorithm_version": "adaptive-roi-v1",
      "line_extraction_version": "dark-ridge-v1",
      "line_parameter_version": "baseline-2026-10-27",
      "annotation_status": "annotated",
      "completeness": "partial",
      "handedness": "right",
      "reference_ids": [
        "prd-metemu-2026-10-26",
        "paramarsh-palmistry-complete-guide",
        "pengajarpedia-palmistry-2025-10"
      ],
      "annotator_id": "annotator-01",
      "protocol_version": "rekha-visual-v1",
      "class_states": [
        { "visual_class": "life", "label_status": "provisional", "visibility": "visible", "truncated": false },
        { "visual_class": "head", "label_status": "ambiguous", "visibility": "obscured", "truncated": true },
        { "visual_class": "heart", "label_status": "provisional", "visibility": "absent", "truncated": false },
        { "visual_class": "fate", "label_status": "provisional", "visibility": "undetermined", "truncated": false }
      ],
      "polylines": [
        {
          "id": "manual-1",
          "visual_class": "life",
          "label_status": "provisional",
          "visibility": "visible",
          "truncated": false,
          "points": [{ "x": 140.5, "y": 320.2 }, { "x": 180.8, "y": 520.4 }]
        }
      ]
    }
  ]
}
```

## Aturan validasi

1. Fingerprint sumber dan hash piksel ROI harus SHA-256 64 digit heksadesimal.
2. ROI signature, dimensi, dan versi `adaptive-roi-v1` harus cocok dengan sampel.
3. Semua koordinat harus finite dan berada di dalam ROI asli; tidak ada rescale,
   mirror, crop ulang, atau perbaikan otomatis saat import.
4. Empat class state inti harus hadir tepat satu kali.
5. `visible` pada class state memerlukan polyline kelas yang sama.
6. `absent` atau `undetermined` tidak boleh memiliki polyline kelas yang sama.
7. Polyline memerlukan sedikitnya dua titik dan enum yang valid.
8. `annotator_id` hanya ID anonim 3–64 karakter alfanumerik, `_`, atau `-`.
9. Reference ID dan versi protokol wajib tersedia pada ekspor versi 3.
10. Mismatch identitas ditahan tanpa scoring; data tidak diperbaiki diam-diam.

Manifest benchmark tetap versi 1 dan mengikat PNG, SHA-256 file, SHA-256 piksel,
fingerprint sumber, ROI signature, dimensi, serta file anotasi. Python menerima
anotasi versi 2 dan 3; metadata kelas baru tidak mengubah geometri benchmark
historis atau detektor.
