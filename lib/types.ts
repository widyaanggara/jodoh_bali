// Master Data Types

export interface Wuku {
  id_wuku: number;
  nama_wuku: string;
  deskripsi: string;
  sifat_umum: string;
  kelebihan: string;
  kelemahan: string;
  rekomendasi_pasangan: string[];
}

export interface Lintang {
  nama: string;
  saptawara: string;
  pancawara: string;
  sifat: string;
  nasib: string;
}

export interface Pancawara {
  id: number;
  nama: string;
  urip: number;
  karakter: string;
}

export interface Sadwara {
  nama: string;
  arti: string;
  sifat: string;
  pesan: string;
}

export interface Saptawara {
  id: number;
  hari: string;
  urip: number;
  sifat: string;
  karakter: string;
}

export interface KategoriJodoh {
  sisa: number;
  kategori: string;
  makna: string;
}

export interface Zodiak {
  nama: string;
  startMonth: number;
  startDate: number;
  sifat: string;
  elemen: string;
  angkaHoki: number[];
  warnaHoki: string;
  hariHoki: string;
}

// Calculated Types

export interface BalineseDate {
  wuku: Wuku;
  pancawara: Pancawara;
  saptawara: Saptawara;
  totalUrip: number;
  lintang?: Lintang;
  nextOtonan?: string;
}

export interface CompatibilityResult {
  person1: BalineseDate;
  person2: BalineseDate;
  totalUrip: number;
  kategori: KategoriJodoh;
  percentage: number;
}

export interface MatchingDate {
  date: Date;
  balineseDate: BalineseDate;
  kategori: KategoriJodoh;
  percentage: number;
}
