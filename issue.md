# Fitur: Login User dan Manajemen Session

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur Otentikasi/Login. Kita perlu membuat tabel database untuk mencatat sesi (session) pengguna serta menyediakan satu endpoint API baru untuk memproses login.

## Detail Persyaratan (Requirements)

1. **Pembuatan Tabel `sessions` di Database**:
   - `id`: tipe *integer*, *auto increment*, *primary key*.
   - `token`: tipe *varchar(255)*, *not null*. Akan berisi nilai unik (UUID) token otentikasi.
   - `user_id`: tipe *integer*, berfungsi sebagai *foreign key* yang merujuk ke tabel `users`.
   - `created_at`: tipe *timestamp*, *default current_timestamp*.

2. **Spesifikasi Endpoint API Login**:
   - **Method & URL**: `POST /api/users/login`
   - **Request Body (JSON)**:
     ```json
     {
         "email": "user@email.com",
         "password": "plain password"
     }
     ```
   - **Response Berhasil** (HTTP Status: 200 OK):
     ```json
     {
         "status": 200,
         "message": "user logged in successfully",
         "data": {
             "name": "sample user",
             "token": "uuid-token"
         }
     }
     ```
   - **Response Gagal** (Kredensial tidak valid) (HTTP Status: 400 Bad Request):
     ```json
     {
         "status": 400,  
         "message": "incorrect email or password combination",
         "data": null
     }
     ```

3. **Standar Struktur Folder**:
   - Seluruh logika routing ElysiaJS tetap ditempatkan di dalam folder `src/routes`. Gunakan/lanjutkan file `users-route.ts`.
   - Seluruh *business logic* tetap ditempatkan di dalam folder `src/services`. Gunakan/lanjutkan file `users-service.ts`.

---

## Panduan Implementasi (Step-by-Step Guide)

Bagian ini ditujukan kepada programmer atau agen AI yang akan melanjutkan tugas ini.

### Langkah 1: Update Skema Database
- Buka file `src/db/schema.ts`.
- Buat pendefinisian tabel baru `sessions` menggunakan format Drizzle ORM (`mysqlTable`), pastikan tipe datanya selaras dengan pesyaratan (gunakan referensi untuk foreign key `user_id`).
- Setelah tersimpan, jalankan Drizzle Kit untuk menerapkan ke MySQL:
  1. `bunx drizzle-kit generate`
  2. `bunx drizzle-kit push`

### Langkah 2: Buat Logika Service (Business Logic)
- Buka file `src/services/users-service.ts`.
- Tambahkan fungsi asinkron (misal: `loginUser`) yang menerima `email` dan `password`.
- **Alur kerja di dalam fungsi**:
  1. Cari data *user* berdasarkan `email` di database.
  2. Jika user tidak ditemukan, *throw Error* dengan pesan "incorrect email or password combination".
  3. Jika ditemukan, gunakan metode `bcrypt.compare` untuk mencocokkan `password` (input) dengan password hashing di database.
  4. Jika tidak cocok, *throw Error* dengan pesan yang *sama seperti langkah 2* (penting agar tidak membocorkan informasi apakah email ada atau tidak).
  5. Jika cocok, *generate* string UUID acak (contoh: pakai `crypto.randomUUID()`).
  6. Masukkan (`insert`) baris baru ke tabel `sessions` menggunakan Drizzle. Berisi `token` UUID tersebut dan `user_id` yang login.
  7. Return tipe objek yang memiliki `name` dan `token` saja.

### Langkah 3: Tambahkan Routing (Routes)
- Buka file `src/routes/users-route.ts`.
- Di bawah routing `POST /` (registrasi), tambahkan _chain_ method `.post('/login', ...)` pada grup `/users`.
- Konfigurasikan struktur *body validation* Elysia (via `t.Object`) yang mewajibkan adanya tipe `email` (string) dan `password` (string).
- Di dalam _handler_ fungsi:
  1. Ekstrak *body* dan lemparkan datanya ke konfirmasi dari `loginUser` pada berkas `users-service`.
  2. Dalam skenario `try` (Sukses): Atur `set.status = 200` lalu berikan respons JSON sesuaikan dengan contoh di Requirement 2 di atas.
  3. Dalam skenario `catch` (Gagal): Atur `set.status = 400` dan respons JSON error yang format datanya diambil dari pesan error yang di-_throw_.

### Langkah 4: Pengujian (Verification)
- Meluncurkan lokal server menggunakan perintah `bun run dev`.
- Menggunakan curl/Postman dan uji API `POST /api/users/login` dengan mengirimkan email fiktif. Hasil harus merespon HTTP `400`.
- Kirim kembali menguji kombinasi email registrasi sebelumnya dan *password* yang sah. Hasil seharusnya `200` dengan kembalian berupa `token` dan nama pengguna.
