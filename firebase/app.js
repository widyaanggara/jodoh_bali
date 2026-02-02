import { db } from "./firebase.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  collection, 
  onSnapshot, 
  getDocs, 
  query,
  where,
  orderBy
} from "firebase/firestore";

/**
 * Menyimpan log aktivitas ke Firestore.
 * Mencegah duplikat: data hanya disimpan jika kombinasi fitur dan tanggal belum ada.
 * @param {string} tipeFitur
 * @param {string} tglLahir
 * @param {string|null} [tglLahir2=null]
 */
export async function simpanLog(tipeFitur, tglLahir, tglLahir2 = null) {
  try {
    // 1. Cek apakah data ini sudah pernah disimpan sebelumnya
    const q = query(
      collection(db, "daily_logs"),
      where("feature_type", "==", tipeFitur),
      where("tanggal_lahir", "==", tglLahir),
      where("tanggal_lahir_2", "==", tglLahir2) 
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("Data duplikat terdeteksi. Tidak menyimpan data yang sama.");
      return; // Berhenti di sini jika data sudah ada
    }

    // 2. Siapkan data baru
    const logData = {
      feature_type: tipeFitur,
      tanggal_lahir: tglLahir,
      tanggal_lahir_2: tglLahir2, // Kita simpan tglLahir2 (bisa null) agar pengecekan duplikat konsisten
      created_at: serverTimestamp()
    };

    // 3. Simpan ke Firebase
    await addDoc(collection(db, "daily_logs"), logData);
    console.log("Log aktivitas baru berhasil disimpan!");
  } catch (error) {
    console.error("Gagal menyimpan log ke Firebase:", error);
  }
}

/**
 * Fungsi 'Listener' untuk mengambil data secara real-time.
 * Menggunakan onSnapshot agar UI update otomatis saat ada perubahan data.
 * Diurutkan berdasarkan waktu pembuatan (terbaru di atas).
 * @param {Function} callback - Fungsi yang akan dipanggil setiap kali ada perubahan data.
 */
export function listenTotalLog(callback) {
  const q = query(
    collection(db, "daily_logs"),
    orderBy("created_at", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const totalLog = snapshot.size;
    console.log("Real-time Update: Total log saat ini =", totalLog);
    if (callback) callback(totalLog);
  }, (error) => {
    console.error("Error listening to logs:", error);
  });
}

/**
 * Fungsi untuk mengambil semua data log (mirip SELECT * di Supabase).
 * Mengembalikan array berisi seluruh data, diurutkan dari yang terbaru.
 */
export async function ambilDataLog() {
  try {
    const q = query(
      collection(db, "daily_logs"),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const dataLog = [];
    
    querySnapshot.forEach((doc) => {
      // Mengambil semua data dokumen agar semua input dari setiap fitur terbawa
      dataLog.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return dataLog;
  } catch (error) {
    console.error("Error fetching all logs:", error);
    return [];
  }
}
