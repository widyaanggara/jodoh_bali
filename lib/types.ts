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

export interface Pancawara {
  id: number;
  nama: string;
  urip: number;
  karakter: string;
}

export interface Saptawara {
  id: number;
  hari: string;
  sifat: string;
  karakter: string;
}

export interface KategoriJodoh {
  sisa: number;
  kategori: string;
  makna: string;
}

// Calculated Types

export interface BalineseDate {
  wuku: Wuku;
  pancawara: Pancawara;
  saptawara: Saptawara;
  totalUrip: number;
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
