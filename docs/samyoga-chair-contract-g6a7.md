# Kontrak dominasi Ketua dan Wakil Ketua — G6A.7-R1

Versi desain: `g6a7r1-chair-contract-draft-0.2`. **READY FOR PRODUCT REVIEW untuk dokumen; implementasi/aktivasi tetap HOLD.** Seluruh tipe dan langkah di sini adalah spesifikasi, bukan modul runtime. Tidak ada alokasi peran atau UI baru.

## 1. Baseline aktual

Worktree `C:\Project-Trispark\jodoh_bali_samyoga`; branch `feat/samyoga-group`; HEAD `6298a4ca22c20ae296ec667be792e3c91532fe47`. Awal G6A.7-R1: tiga dokumen G6A.7 masih untracked; staged dan diff tracked kosong. Awal G6A.7 sebelumnya memang bersih. Revisi dibatasi pada tiga dokumen itu.

Checkpoint lokal sudah tersedia: G6A.5 `b35ef2c` (gate produk dan simulasi), G6A.6 `6298a4c` (tiga dokumen provenance/review). Temuan uncommitted dalam laporan G6A.6 adalah kondisi historis saat audit tersebut, bukan kondisi awal G6A.7. Dokumen lama dipertahankan.

Fakta yang dibaca:

| Fondasi | Kontrak aktual dan konsekuensi desain |
| --- | --- |
| [G2, tipe input/output](../lib/samyoga-group.ts#L42) | 3–6 ID unik; civil date/jam divalidasi. Hasil berisi kategori tiap pasangan dan ringkasan tiap anggota. Modul peran tidak mem-parsing ulang tanggal lahir. |
| [G2, kalkulasi](../lib/samyoga-group.ts#L245) | Loop i < j; pasangan di-canonical-kan; setiap pasangan menambah dua ringkasan. Tepat N(N−1)/2 pasangan unik dan N−1 relasi per anggota untuk input valid. |
| [Ringkasan per anggota](../lib/samyoga-group.ts#L292) | pairCount dan categoryCounts dihitung dari pairs, bukan label dominan kelompok. Jumlah Utama per anggota berbeda dari jumlah Utama seluruh kelompok. |
| [Ringkasan presentasi](../lib/samyoga-group-summary.ts#L140) | Komposisi/dominan adalah presentasi; tidak menjadi syarat Ketua atau ranking individu. Validasi presentasi tidak menggantikan validasi graf lengkap. |
| [Evaluator Otonan](../lib/samyoga-position-recommendation.ts#L87) | recommended, multiple_candidates, conflicting_indicators, insufficient_basis; tidak ada ukuran kekuatan Otonan. Urutan taksonomi/ID hanya serialisasi, bukan prioritas jabatan. |
| [Approval rule](../lib/samyoga-position-recommendation.ts#L107) | Domain dan produk wajib approved, dimensi valid dan tidak kosong. Registry/rule produksi tetap kosong. |
| [Resolver evidence](../lib/samyoga-position-evidence.ts#L88) | Identitas/kutipan master tepat, provenance verified, sourceId dan review approved. active buatan/hasil deserialize tidak melewati WeakSet resolver. |
| [G6A.6](samyoga-position-provenance-g6a6.md) | 22 evidence masih missing/pending; belum ada ruleset budaya/posisi produksi yang disetujui. |

## 2. Keputusan dan batas makna

Pemilik produk **memilih Opsi A** melalui instruksi G6A.7: usulan Ketua memerlukan dukungan Leader berbasis interpretasi Otonan yang disetujui **dan** dukungan relasi Samyoga. Tidak ada indikator yang dapat menggantikan gerbang lain. Wakil pada desain ini juga harus lolos kedua gerbang.

**APPROVED DESIGN PRINCIPLE — keputusan produk eksplisit G6A.7-R1:** “Jumlah Utama tidak dapat mengalahkan ketidaktersediaan pembanding kekuatan Otonan.” Lebih banyak Utama tidak otomatis menjadikan seseorang Ketua ketika kekuatan Otonan kedua kandidat belum dapat dibandingkan. Prinsip ini menggantikan usulan fallback count pada versi 0.1.

Opsi A dan prinsip tersebut tidak menyetujui ruleset budaya, metode pembanding, ambang mayoritas, kebijakan Wakil, atau aktivasi produksi. Detail implementasi dominasi tetap proposal review. Lihat [decision log](samyoga-chair-decision-log-g6a7.md).

Ketua/Wakil adalah **usulan peran kelompok simbolis**, bukan jabatan formal, ukuran kepemimpinan/kompetensi profesional, atau kategori asli Wariga. Wakil adalah alokasi peran organisasi dari kandidat yang sama-sama layak, **bukan** pengenalan Co-Leader dari kalender. Rule Co-Leader individu dan Koordinator tetap HOLD; hasil individu tidak ditulis ulang menjadi Ketua/Wakil.

## 3. Batas modul dan identitas input

Modul alokasi kelak terpisah dari interpretasi individu. Alur dependensi yang diusulkan:

- G2 menghasilkan hasil pasangan dan ringkasan.
- Evaluator produksi Otonan menghasilkan interpretasi individu tanpa menggunakan relasi Samyoga.
- Adapter terpercaya menyusun evaluasi untuk semua memberId pada revisi input yang sama, dari registry/versi yang disetujui.
- Modul alokasi murni membaca hasil tersebut dan kebijakan alokasi yang disetujui; tidak mengubah hasil Otonan, G2, maupun master.
- UI kelak hanya mempresentasikan hasil, tanpa perhitungan tambahan. Belum ada implementasi pada milestone ini.

Input tidak memerlukan nama/tanggal/jam lahir atau data Pal Sri Sedana. MemberId hanya menghubungkan hasil; ID, nama dan urutan tidak boleh memilih pemenang. `evaluationRevision` adalah token in-memory yang berubah ketika anggota/data diubah, bukan fingerprint kelahiran, timestamp sebagai prioritas, atau penyimpanan persisten.

Tipe berikut rancangan struktural. `TrustedOtonanAssessment` dan `ApprovedAllocationContext` harus dibuat adapter/registry internal kelak, bukan JSON atau flag approved dari pengguna. Keduanya **belum tersedia di runtime**; typedef bukan implementasi keamanan.

```typescript
type ChairStatus =
  | "not_evaluated" | "no_qualified_candidate" | "chair_only"
  | "chair_and_deputy_proposed" | "undetermined" | "conflicting_priority";

type GateStatus = "NOT_EVALUATED" | "QUALIFIED" | "NOT_QUALIFIED";

type OtonanComparison =
  | "STRONGER" | "WEAKER" | "EQUIVALENT"
  | "INCOMPARABLE" | "UNKNOWN"; // A relatif terhadap B

interface ChairAllocationInput {
  readonly memberIds: readonly string[]; // 3–6 unik, bukan nama/urutan prioritas
  readonly evaluationRevision: string;
  readonly samyoga: SamyogaGroupResult; // tipe G2 existing
  readonly otonan: readonly TrustedOtonanAssessment[]; // tepat satu per anggota
  readonly approvalContext: ApprovedAllocationContext;
}

interface TrustedOtonanAssessment {
  readonly memberId: string;
  readonly evaluationRevision: string;
  readonly recommendation: SamyogaPositionRecommendation; // existing
  readonly evaluationState: "complete" | "basis_unavailable";
  readonly leaderSupport: {
    readonly matchedLeaderRuleIds: readonly string[];
    readonly supportingEvidenceIds: readonly string[];
    readonly appliedCautionEvidenceIds: readonly string[];
  };
  readonly sourceRegistryVersion: string;
  readonly culturalDecisionRefs: readonly string[];
  readonly ruleProductDecisionRefs: readonly string[];
  // Adapter membuktikan kesesuaian input/registry/resolver; field ini
  // tidak boleh dipercaya hanya karena diisi dalam object literal.
}

interface ApprovedAllocationContext {
  readonly contractVersion: string;
  readonly option: "A";
  readonly otonanBasisState: "available" | "unavailable";
  readonly samyogaPolicy: {
    readonly id: "strict_majority_utama";
    readonly version: string;
    readonly approvalDecisionRef: string | null;
  };
  readonly selectionPolicy: {
    readonly id: "pareto_dominates_all_v1";
    readonly version: string;
    readonly approvalDecisionRef: string | null;
  };
  readonly deputyPolicy: {
    readonly id: "exactly_two_qualified_v1";
    readonly version: string;
    readonly approvalDecisionRef: string | null;
  };
  readonly leaderEligibilityPolicyDecisionRef: string | null;
  readonly incompleteBasisPolicyDecisionRef: string | null;
  readonly comparison:
    | { readonly mode: "unavailable"; readonly state: "UNKNOWN"; readonly comparisons: null }
    | {
        readonly mode: "approved_relative_otonan";
        readonly comparatorVersion: string;
        readonly approvalDecisionRef: string;
        readonly comparisons: readonly {
          readonly memberAId: string;
          readonly memberBId: string;
          readonly result: OtonanComparison;
          readonly basisRefs: readonly string[];
          readonly unknownReason: string | null; // wajib pada UNKNOWN
        }[];
      };
}
```

Nomor versi dan reference tidak cukup sendirian: adapter wajib mencocokkannya dengan keputusan nyata yang masih berlaku untuk versi rule/evidence/policy itu. Perubahan aturan atau pencabutan approval membuat konteks lama tidak berlaku. Tidak ada auto-approval akibat dokumen ini dibuat.

## 4. Validasi struktur sebelum memilih kandidat

Validasi ini merupakan kontrak batas modul baru, bukan perubahan engine G2:

1. N integer 3–6; ID nonkosong dan unik; tepat satu assessment dan satu memberSummary per ID; tidak ada ID asing.
2. pairCount = pairs.length = N(N−1)/2; tidak ada self-pair, anggota asing, pasangan hilang atau pasangan terduplikasi, termasuk A–B plus B–A. Canonical key harus cocok dengan dua endpoint menggunakan helper G2. Duplikasi ditolak, **tidak** dideduplikasi diam-diam karena mengubah hasil.
3. Kategori hanya Utama/Madia/Nista. Hitung ulang **hitungan kategori** dari graf G2 untuk verifikasi, bukan menghitung ulang formula Samyoga. Per anggota: pairCount = Utama + Madia + Nista = N−1.
4. Ringkasan tiap anggota harus tepat sama dengan graf. Ringkasan kelompok harus tepat sama dengan pasangan. Untuk setiap kategori, jumlah hitungan semua anggota = 2 × hitungan pasangan kategori itu. Seluruh count integer nonnegatif.
5. symbolicAttention/Nista dan daftar pairKey perhatian konsisten; tidak boleh menyembunyikan Nista dari penjelasan.
6. Revisi anggota, seluruh assessment, versi registry, keputusan approval dan comparator harus sama-sama berlaku. Hasil lama setelah edit tidak boleh dipakai.

Kegagalan struktur/kepercayaan menghasilkan `not_evaluated` dengan reason code, bukan no_qualified_candidate atau crash. Tidak ada usulan parsial dari input rusak.

## 5. Readiness dan dua gerbang

### 5.1 Readiness global

Sebelum interpretasi kelayakan, harus tersedia scope ruleset Leader yang disetujui: provenance dan review evidence yang digunakan, review rule, approval produk rule, daftar sumber/aturan dan cakupan yang dinyatakan cukup oleh reviewer. Approval Opsi A bukan approval terhadap scope ini.

Scope approved tidak harus memasukkan semua 22 kandidat: kandidat boleh ditolak atau ditunda dengan keputusan eksplisit. Tetapi tidak boleh menyebut scope lengkap hanya karena beberapa evidence yang belum disetujui dihilangkan. Ketidakadaan support setelah scope approved diterapkan berbeda dari belum tersedianya basis yang bisa dievaluasi.

Policy dasar eligibility/mayoritas/dominasi harus disetujui terpisah. Jika registry kosong, ruleset/policy dasar belum disetujui, satu assessment kehilangan basis yang seharusnya dinilai, atau versi tidak cocok: `not_evaluated`; Ketua/Wakil null. Jangan memilih dari subset anggota yang kebetulan sudah dinilai. Policy Wakil bersifat terpisah dan tidak memblokir usulan Ketua yang sudah sah; pending/rejected/missing berarti Wakil null.

Readiness dibagi dua tahap: (1) basis seluruh gerbang eligibility; (2) basis pembandingan untuk Q≥2. Bila tahap pertama gagal, Q belum diketahui dan qualifiedMemberIds kosong. Bila eligibility selesai tetapi comparator belum disetujui/tersedia, Q boleh dilaporkan sebagai himpunan layak tanpa alokasi; status alokasi tetap not_evaluated. Q=0 atau Q=1 tidak memerlukan pembanding antarkandidat. Kebijakan coverage/fail-closed tahap eligibility masih proposal tersendiri.

Evaluator existing tetap dapat mengembalikan insufficient_basis pada registry kosong. Adapter masa depan membaca readiness konteks terlebih dahulu dan memetakan ke **NOT_EVALUATED**, tanpa mengubah output evaluator existing atau menafsirkan seseorang tidak layak.

### 5.2 Gerbang Otonan

Dengan readiness lengkap, status per anggota:

| Hasil aktual evaluator | Pemeriksaan tambahan | Gerbang |
| --- | --- | --- |
| recommended dengan recommendedPosition Leader | Ada rule Leader approved pada matchedRuleIds dan bukti resolver yang sah | QUALIFIED |
| multiple_candidates mencakup Leader pada alternativePositions | Ada rule Leader yang benar-benar match, approval lengkap, dan tidak ada konflik global | QUALIFIED, dengan catatan beberapa kecenderungan individu; tidak dipilih satu posisi individu |
| recommended posisi lain / multiple tanpa Leader | Evaluasi approved lengkap | NOT_QUALIFIED — LEADER_NOT_SUPPORTED |
| conflicting_indicators | Leader pada alternatif tetap provisional | NOT_QUALIFIED — OTONAN_CONFLICT |
| insufficient_basis setelah scope approved lengkap diterapkan | Tidak ada dasar Leader yang memadai untuk anggota itu | NOT_QUALIFIED — LEADER_BASIS_INSUFFICIENT |
| Basis/evidence/rule belum disetujui atau hasil tidak terpercaya | Jangan mengubah missing approval menjadi gagal personal | NOT_EVALUATED |

Status recommended saja tidak cukup tanpa rule Leader dan sumber yang valid. activeEvidenceIds existing mencakup semua dimensi aktif, bukan penjelasan bukti Leader per-rule. Adapter kelak harus menelusuri requiredDimensions pada matched rule Leader dan evidence aktif pendukungnya. Ketiadaan metadata coverage/per-rule pada output current adalah gap adapter, bukan izin mempercayai string alternatif atau jumlah tag.

Kekuatan Otonan **tidak** berasal dari banyaknya matchedRuleIds, evidence, kutipan, tag, dimensi, urip, atau status recommended dibanding multiple_candidates.

### 5.3 Gerbang Samyoga: proposal strict_majority_utama

```text
relations = memberCount - 1
qualified = 2 * utamaCount > relations
minimumUtama = floor(relations / 2) + 1
```

| N | Relasi per anggota | Utama terakhir yang gagal | Minimum Utama lolos |
| --- | ---: | ---: | ---: |
| 3 | 2 | 1 | 2 |
| 4 | 3 | 1 | 2 |
| 5 | 4 | 2 | 3 |
| 6 | 5 | 2 | 3 |

Mayoritas ketat berarti lebih dari separuh relasi milik anggota itu. Tidak memakai kategori dominan kelompok, rata-rata kelompok atau semua pasangan sebagai denominator. Tidak ada pembulatan skor. Jumlah Utama adalah hitungan relasi tradisional, bukan skor 0–100 atau ukuran kompetensi personal.

Policy ini **pending approval produk**, bukan formula tradisional Bali. Sebelum approval, gate formal NOT_EVALUATED walau count dapat diaudit. Setelah approval, lolos mayoritas → QUALIFIED; tidak lolos → NOT_QUALIFIED — UTAMA_MAJORITY_NOT_MET.

Nista tetap dicatat sebagai perhatian simbolis; tidak menjadi diskualifikasi otomatis, pengurang skor, veto atau prioritas tie-break. Contoh sintetis N=4: 2 Utama + 0 Madia + 1 Nista tetap lolos gerbang Samyoga.

### 5.4 Kandidat gabungan

Himpunan Q hanya berisi anggota dengan Otonan QUALIFIED **dan** Samyoga QUALIFIED. Otonan lebih kuat tidak menyelamatkan anggota yang gagal mayoritas; banyak Utama tidak menyelamatkan anggota yang tidak mendapat dukungan Leader. Anggota di luar Q tetap mendapat alasan tiap gerbang dan ringkasan Nista, bukan label negatif.

## 6. Lima keadaan pembanding kekuatan Otonan

Kelayakan Leader bukan ukuran kekuatan relatif. Saat ini belum ada ruleset pembanding yang disetujui. Tidak ada lagi jalur alokasi `eligibility_only`; nilai Utama tertinggi tidak menjadi pengganti comparator.

Hasil selalu berorientasi **A relatif terhadap B**:

| Keadaan | Makna | Bukti yang diperlukan |
| --- | --- | --- |
| STRONGER | A lebih kuat Otonan daripada B menurut aturan relatif yang disetujui | Versi comparator, approval, hasil penerapan dan basisRefs yang sah |
| WEAKER | A lebih lemah daripada B; kebalikan STRONGER | Persyaratan sama |
| EQUIVALENT | Kesetaraan simbolis secara eksplisit didukung aturan pembanding approved | Bukti positif kesetaraan; bukan sekadar tidak menemukan perbedaan |
| INCOMPARABLE | Profil tidak dapat diurutkan dalam aturan yang tersedia | Aturan sah telah diterapkan, tetapi tidak menyediakan urutan keduanya |
| UNKNOWN | Dasar/metode pembanding belum tersedia atau belum cukup untuk memastikan relasi | Alasan ketidaktersediaan; tidak mengklaim hasil pembandingan sah |

UNKNOWN dan INCOMPARABLE tidak sama dengan EQUIVALENT. `no_proven_difference` versi 0.1 **tidak dimigrasikan menjadi EQUIVALENT**; tanpa bukti kesetaraan diperlakukan UNKNOWN. Model lama a_stronger/b_stronger hanya padanan arah STRONGER/WEAKER, bukan persetujuan metode budaya.

Pertukaran A/B membalik STRONGER ↔ WEAKER. EQUIVALENT, INCOMPARABLE dan UNKNOWN simetris. Jumlah tag, evidence, kutipan, kata positif, dimensi, urip atau skor arbitrer tidak mengukur kekuatan. Status multiple_candidates tidak berarti lebih lemah/kuat daripada recommended.

### 6.1 Validitas comparator dan pelaporan UNKNOWN

Untuk Q≥2, setiap pasangan unik Q mempunyai record pembandingan atau status ketidaktersediaan yang eksplisit. Jangan menyimpulkan state dari field yang hilang:

- Ruleset pembanding/approval belum tersedia → UNKNOWN dengan reason OTONAN_COMPARATOR_UNAPPROVED/OTONAN_COMPARATOR_UNAVAILABLE; alokasi **not_evaluated**, tidak ada peran.
- Comparator approved diterapkan tetapi basis tidak cukup untuk membuktikan relasi pasangan → record UNKNOWN, unknownReason wajib; dominasi pasangan tidak terbukti. Jika tidak ada dominator universal, **undetermined**.
- INCOMPARABLE adalah hasil penerapan sah; tidak diubah menjadi seri/setara.
- Record hilang/duplikat, versi salah, basisRefs STRONGER/WEAKER/EQUIVALENT/INCOMPARABLE tidak sah, atau data tidak terpercaya → not_evaluated — COMPARATOR_BASIS_UNAVAILABLE/COMPARATOR_INCONSISTENT. Ini input invalid, bukan otomatis UNKNOWN yang dianggap evaluasi selesai.
- Tidak ada self-comparison, pasangan asing, hasil berlawanan yang tidak konsisten, strict-cycle A>B>C>A, atau klaim EQUIVALENT yang bertentangan dengan strict superiority. Comparator kelak wajib koheren. Alokasi tidak mengisi UNKNOWN memakai dugaan transitivitas, kata mirip, atau “jumlah tag sama”.
- Bila A secara sah mendominasi semua yang lain, UNKNOWN/INCOMPARABLE di antara kandidat lain tidak membatalkan bukti A terhadap mereka. Tidak ada Wakil otomatis dari sisa kandidat.

### 6.2 Dominasi setelah dua gerbang

Q adalah himpunan kandidat layak, tanpa urutan. Untuk A,B ∈ Q, definisikan:

```text
dominates(A, B) =
  validApprovedComparison(A, B)
  AND (
    (otonan(A,B) == STRONGER   AND utama(A) >= utama(B))
    OR
    (otonan(A,B) == EQUIVALENT AND utama(A) >  utama(B))
  )
```

Artinya A tidak lebih lemah pada kedua indikator dan unggul jelas setidaknya pada satu indikator. Perbandingan count Utama hanya dipakai dalam kebijakan produk dominasi yang disetujui; tidak dibuat rumus tradisional baru.

| Otonan A terhadap B | Utama A lebih banyak | Utama sama | Utama A lebih sedikit |
| --- | --- | --- | --- |
| STRONGER | A mendominasi B | A mendominasi B | Konflik prioritas |
| WEAKER | Konflik prioritas | B mendominasi A | B mendominasi A |
| EQUIVALENT sah | A mendominasi B | Tidak ada dominasi | B mendominasi A |
| INCOMPARABLE | Tidak ada dominasi | Tidak ada dominasi | Tidak ada dominasi |
| UNKNOWN | Tidak ada dominasi | Tidak ada dominasi | Tidak ada dominasi |

Otonan kuat + Utama sama **dapat** membuktikan dominasi; ini merevisi cabang seri otomatis versi 0.1. Count lebih tinggi + Otonan UNKNOWN/INCOMPARABLE **tidak** dapat membuktikannya. Jika kedua indikator mengunggulkan orang berbeda, jangan memilih bobot/prioritas tersembunyi.

## 7. Kebijakan Ketua/Wakil dan urutan keputusan

Prinsip larangan fallback count telah disetujui. Cabang operasional dominasi dan policy Wakil berikut masih desain untuk review; tidak ada aktivasi.

1. Validasi struktur dan readiness eligibility. Gagal → not_evaluated, peran null, Q belum diketahui.
2. Semua gerbang selesai:
   - Q=0 → no_qualified_candidate.
   - Q=1 → chair_only sebagai satu-satunya kandidat dua gerbang, tanpa klaim lebih kuat dari anggota lain. Wakil null; comparator antarkandidat tidak diperlukan.
3. Q≥2: pastikan ruleset pembanding dan policy dominasi disetujui/valid. Bila belum tersedia → not_evaluated dengan state UNKNOWN; Q yang sudah terbukti layak boleh tetap ditampilkan.
4. Bentuk relasi dominates hanya dari pembandingan sah. Cari **D = { A ∈ Q | untuk setiap B ∈ Q selain A, dominates(A,B) }**. Bukan sekadar maksimum Utama atau kandidat yang belum terbukti kalah.
5. Jika D tepat satu:
   - Q=2: usulkan A sebagai Ketua. Wakil = kandidat lain **hanya jika** policy exactly_two_qualified_v1 telah disetujui untuk versi/konteks itu; status chair_and_deputy_proposed. Jika pending/rejected/missing, status chair_only, Wakil null dan DEPUTY_POLICY_UNAPPROVED.
   - Q≥3: chair_only; Wakil null walau kandidat kedua tampak unik. Perlu kontrak tambahan untuk memilih Wakil.
6. Jika D kosong:
   - Ada pasangan Q dengan arah Otonan dan Utama berlawanan → conflicting_priority; kedua peran null.
   - Selain itu → undetermined; alasan dapat berupa UNKNOWN, INCOMPARABLE, EQUIVALENT+Utama sama, atau NO_UNIVERSAL_DOMINATOR.
   - Konflik yang sah menjadi reason utama bila juga ada UNKNOWN/INCOMPARABLE; seluruh keterbatasan tetap dicatat.
7. Jika D lebih dari satu, comparator/data dominasi tidak konsisten → not_evaluated — COMPARATOR_INCONSISTENT. Tidak memilih memakai ID/input/nama.
8. Konflik di antara non-Ketua tetap dicatat sebagai konteks, tetapi tidak menggantikan bukti dominasi universal yang sah pada langkah 5. Tidak ada pemilihan Wakil dari konflik sisa kandidat.

| Keadaan | Status | Ketua | Wakil |
| --- | --- | --- | --- |
| Basis eligibility/struktur/policy dasar belum sah | not_evaluated | null | null |
| Q=0 setelah evaluasi lengkap | no_qualified_candidate | null | null |
| Q=1 | chair_only | Kandidat Q | null |
| Q≥2, ruleset pembanding belum approved/tersedia (UNKNOWN) | not_evaluated | null | null |
| Q=2, ada dominator sah, policy Wakil approved | chair_and_deputy_proposed | Dominator | Kandidat lain |
| Q=2, ada dominator sah, policy Wakil pending/rejected/missing | chair_only | Dominator | null |
| Q≥3, tepat satu kandidat mendominasi semua lainnya | chair_only | Dominator universal | null |
| Tidak ada dominator universal; indikator berlawanan | conflicting_priority | null | null |
| Tidak ada dominator universal; seri/UNKNOWN/INCOMPARABLE dalam evaluasi yang valid | undetermined | null | null |
| Comparator/bukti dominasi invalid | not_evaluated | null | null |

Tidak ada top-Utama fallback, pemaksaan satu jabatan, atau runner-up otomatis. Memiliki satu kandidat nondominated belum cukup jika dominasi terhadap semua kandidat lain tidak terbukti.

## 8. Kontrak output dan reason codes

```typescript
interface ChairAllocationResult {
  readonly status: ChairStatus;
  readonly chairMemberId: string | null;
  readonly deputyMemberId: string | null;
  readonly qualifiedMemberIds: readonly string[];
  readonly reasonCodes: readonly string[]; // kode pada tabel di bawah
  readonly pairwiseComparisons: readonly {
    readonly memberAId: string;
    readonly memberBId: string;
    readonly state: OtonanComparison;
    readonly basisRefs: readonly string[];
    readonly unknownReason: string | null;
  }[];
  readonly dominancePairs: readonly { readonly dominatorId: string; readonly otherId: string }[];
  readonly universalDominatorIds: readonly string[];
  readonly memberDecisions: readonly {
    readonly memberId: string;
    readonly otonanGate: GateStatus;
    readonly samyogaGate: GateStatus;
    readonly qualified: boolean;
    readonly counts: { readonly Utama: number; readonly Madia: number; readonly Nista: number };
    readonly requiredUtama: number; // 2,2,3,3 untuk N=3,4,5,6
    readonly leaderRuleIds: readonly string[];
    readonly evidenceRefs: readonly string[]; // hanya evidence resolved terkait Leader
    readonly otonanReasonCodes: readonly string[];
    readonly samyogaReasonCodes: readonly string[];
    readonly attentionPairKeys: readonly string[]; // termasuk Nista, bukan blocker
  }[];
  readonly basisSummary: {
    readonly evaluationRevision: string;
    readonly contractVersion: string;
    readonly samyogaPolicyVersion: string;
    readonly selectionPolicyVersion: string;
    readonly deputyPolicyVersion: string;
    readonly approvalDecisionRefs: readonly string[];
    readonly otonanRegistryVersion: string | null;
    readonly comparisonMode: "unavailable" | "approved_relative_otonan" | "not_required" | "not_evaluated";
    readonly relativeStrengthClaim: "UNKNOWN" | "comparison_applied" | "not_required" | "not_evaluated";
    readonly pairKeysConsidered: readonly string[];
    readonly comparisonBasisRefs: readonly string[];
  };
  readonly interpretationScope: "metemu-symbolic-group-role-proposal";
}
```

memberDecisions hanya diterbitkan untuk ID/count yang valid; input rusak tidak diisi angka karangan. Jika eligibility belum dapat dinilai, qualifiedMemberIds kosong. Jika kedua gerbang sudah lengkap tetapi comparator tidak tersedia, Q tetap boleh dilaporkan dengan status alokasi not_evaluated dan peran null. Kelayakan tidak sama dengan penetapan peran.

pairwiseComparisons mempertahankan state/basis/reason, termasuk UNKNOWN. dominancePairs hanya memuat dominasi yang sudah terbukti; tidak boleh berisi edge dari UNKNOWN/INCOMPARABLE. universalDominatorIds adalah hasil pemeriksaan mendominasi **semua** Q lain, bukan daftar ranking atau “jumlah kemenangan”. Untuk Q=0/1 gunakan array kosong dan not_required; tidak membuat self-dominance.

Mode unavailable menyatakan UNKNOWN tanpa mengklaim comparison_applied. Hanya comparator sah yang benar-benar diterapkan boleh memakai comparison_applied. Catatan approval/ruleset kosong tidak disajikan seolah verifikasi budaya telah terjadi.

| Reason code | Keadaan |
| --- | --- |
| INVALID_GROUP_SHAPE | N/ID/assessment/summary tidak valid, termasuk duplikasi ID atau ID asing |
| INVALID_PAIR_GRAPH | Self-pair, missing pair, foreign member, key salah atau duplikasi termasuk arah terbalik |
| RELATION_SUMMARY_MISMATCH | Count/summary/category/attention tidak sesuai graf atau N−1 |
| STALE_EVALUATION | Revisi input/assessment berbeda |
| OTONAN_BASIS_UNAVAILABLE | Registry/scope ruleset Leader belum siap, atau assessment kehilangan basis yang diperlukan |
| OTONAN_APPROVAL_INCOMPLETE | Provenance/review evidence/rule/approval produk atau cakupan belum lengkap |
| ALLOCATION_POLICY_UNAPPROVED | Policy dasar eligibility/dominasi pending/rejected/tidak dikenal; policy Wakil ditangani terpisah dan tidak menahan Ketua sah |
| COMPARATOR_BASIS_UNAVAILABLE | Mode relatif dipilih tetapi comparator/pasangan/basis/approval tidak lengkap |
| COMPARATOR_INCONSISTENT | Hasil relatif invalid, berulang, asimetris atau strict-cycle |
| LEADER_SUPPORTED | Gerbang Otonan lolos dengan matched rule Leader dan evidence sah |
| LEADER_NOT_SUPPORTED | Evaluasi lengkap, tetapi Leader tidak termasuk posisi yang didukung |
| LEADER_BASIS_INSUFFICIENT | Scope approved diterapkan lengkap, tidak cukup support Leader |
| OTONAN_CONFLICT | Konflik evaluator existing menahan interpretasi; bukan konflik prioritas antarkandidat |
| UTAMA_MAJORITY_MET / UTAMA_MAJORITY_NOT_MET | Hasil gerbang Samyoga dengan policy approved |
| NISTA_SYMBOLIC_ATTENTION | Konteks Nista; tidak mengubah eligibility atau perbandingan |
| NO_DUAL_GATE_CANDIDATE | Q kosong setelah evaluasi lengkap |
| SINGLE_DUAL_GATE_CANDIDATE | Q satu |
| OTONAN_COMPARATOR_UNAVAILABLE / OTONAN_COMPARATOR_UNAPPROVED | Metode/approval relatif tidak tersedia; UNKNOWN, alokasi not_evaluated untuk Q≥2 |
| OTONAN_COMPARISON_UNKNOWN | Record evaluasi sah belum membuktikan relasi; tidak diasumsikan setara |
| OTONAN_RELATIVE_INCOMPARABLE | Pembanding sah tidak dapat mengurutkan profil |
| OTONAN_EQUIVALENCE_PROVEN | EQUIVALENT didukung aturan/bukti; bukan hanya tidak ada perbedaan teramati |
| DOMINANCE_PROVEN | Satu pasangan memenuhi dominasi dua indikator |
| UNIQUE_UNIVERSAL_DOMINATOR | Tepat satu kandidat mendominasi semua Q lain |
| NO_UNIVERSAL_DOMINATOR | Tidak ada kandidat yang dominasinya terbukti terhadap semua Q lain |
| BOTH_INDICATORS_TIED | EQUIVALENT sah dan jumlah Utama sama |
| OPPOSING_OTONAN_AND_UTAMA | Arah Otonan dan Utama mengunggulkan kandidat berbeda |
| DEPUTY_POLICY_UNAPPROVED | Ketua sah; Wakil null karena policy terpisah belum approved |
| DEPUTY_POLICY_FOR_MORE_THAN_TWO_UNAPPROVED | Q≥3, tidak ada kontrak tambahan Wakil |
| DEPUTY_SEPARATE_APPROVAL_APPLIED | Tepat dua Q dan approval Wakil yang relevan sah |

Kode lama UNIQUE_UTAMA_MAXIMUM, TWO_QUALIFIED_ORDERED, UTAMA_TIE dan RELATIVE_OTONAN_NOT_MEASURED tidak menjadi pemicu keputusan R1. Log count boleh mencatat perbedaan/sama, tetapi tidak menyimpulkan dominasi.

Urutan keputusan: validasi eligibility → kesiapan pembanding → konsistensi comparator → dominator universal → bila tidak ada, konflik prioritas → ketidakpastian/seri. Reason tidak diberi bobot. Konflik pada calon yang tersisa tidak membatalkan Ketua yang sudah mendominasi semuanya.

Invarian output: status tanpa usulan selalu kedua peran null; chair_only tepat satu Ketua; chair_and_deputy_proposed tepat dua ID berbeda di Q plus approval Wakil terpisah. Tidak pernah deputy_only. Untuk Q≥2, setiap Ketua harus berada di universalDominatorIds yang berisi tepat satu ID. Q boleh belum dialokasikan dan bukan ranking. Sort ID hanya serialisasi; permutasi/rename ID tidak mengubah keputusan substantif.

## 9. Gap implementasi dan acceptance berikutnya

Belum ada modul alokasi, readiness scope, comparator kekuatan atau policy produksi yang aktif. Persetujuan prinsip R1 tidak menyelesaikan verifikasi 22 evidence maupun aturan Leader.

Sebelum implementasi/aktivasi: selesaikan review sumber/dimensi dan rule Leader; keputusan mayoritas, mapping multiple_candidates, coverage serta kebijakan dominasi; metode relatif dengan dukungan STRONGER/WEAKER/EQUIVALENT yang sah. Policy Wakil tetap terpisah. Tanpa comparator approved, Q≥2 tidak boleh menghasilkan peran.

Lihat [matriks revisi](samyoga-chair-test-matrix-g6a7.md) dan [decision log](samyoga-chair-decision-log-g6a7.md). Registry/evaluator Otonan, Mod5/Mod16, master, kalender, Samyoga, hasil individu dan Pal Sri Sedana tidak berubah. Tidak ada skor, dependency, network, storage atau UI baru.

## 10. Validasi revisi dan status

R1 mempertahankan ID/graf seluruh 55 fixture lama, merevisi state/approval/expected sesuai prinsip baru, dan menambah kasus dominasi. Fixture sepenuhnya sintetis, tanpa tanggal lahir atau output kalender rekaan. Pemeriksaan ad hoc menguji konsistensi graf, count N−1, dua gerbang, dominasi dan hasil harapan; bukan unit test allocator produksi yang belum ada.

Hasil: **71/71 kasus desain konsisten**, **144/144 permutasi**, **2/2 pembalikan orientasi comparator**, **2/2 rename ID**, dan **17 tautan lokal valid**. Seluruh 55 ID/graf/override Otonan lama dipertahankan. Regression existing **86/86 lulus**. Rincian ada pada decision log; ini bukan klaim allocator produksi sudah tersedia.

Seluruh 86 file tracked baseline identik berdasarkan SHA-256; hanya tiga dokumen desain existing direvisi dan tetap untracked. Staged/diff tracked kosong. TypeScript/lint/build tidak dijalankan ulang untuk revisi Markdown.

**READY FOR PRODUCT REVIEW untuk kontrak R1; implementasi/aktivasi tetap HOLD.** Tidak ada persetujuan budaya/metode relatif/ambang/Wakil/aktivasi yang dibuat otomatis. Tidak ada commit, push, merge, reset, clean atau switch branch.

