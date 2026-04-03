# Belajar Vibe Coding

Sebuah aplikasi backend sederhana yang dibangun menggunakan **ElysiaJS**, **Bun**, dan **Drizzle ORM** dengan database **MySQL**. Aplikasi ini menyediakan fitur manajemen user dasar (Registrasi, Login, Logout) dan dilengkapi dengan dokumentasi API interaktif menggunakan Swagger.

## Fitur Utama
- **User Management**: Registrasi, Login, dan Logout.
- **Interactive Documentation**: Swagger UI untuk eksplorasi API.
- **Unit Testing**: Cakupan tes API (100% coverage pada routing).
- **ORM**: Menggunakan Drizzle ORM untuk interaksi database yang type-safe.

## Teknologi & Framework
- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [ElysiaJS](https://elysiajs.com)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Database**: MySQL
- **Testing**: Bun Test Runner
- **Documentation**: @elysiajs/swagger

## Prasyarat
- [Bun](https://bun.sh) terpasang di sistem Anda.
- Instance MySQL yang sedang berjalan.

## Instalasi

1. Clone repositori ini:
   ```bash
   git clone <repository-url>
   cd belajar-vibe-coding
   ```

2. Instal dependensi:
   ```bash
   bun install
   ```

3. Konfigurasi Environment:
   Buat file `.env` di root project dan sesuaikan konfigurasi database Anda:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/db_name
   ```

## Menjalankan Aplikasi

### Mode Pengembangan (Development)
Menjalankan server dengan fitur *hot reload*:
```bash
bun run dev
```

### Mode Produksi (Production)
```bash
bun start
```

### Menjalankan Testing
Untuk menjalankan unit test:
```bash
bun test
```
Untuk melihat coverage:
```bash
bun test --coverage
```

## Struktur Proyek

```text
.
├── src/
│   ├── index.ts          # Entry point aplikasi
│   ├── routes/           # Definisi endpoint API
│   ├── services/         # Logika bisnis / database interaction
│   └── db/               # Konfigurasi Drizzle & Schema
├── test/                 # File unit testing
├── drizzle/              # File migrasi database
├── .env                  # Konfigurasi environment (diabaikan oleh git)
├── package.json          # Konfigurasi project & dependensi
└── tsconfig.json         # Konfigurasi TypeScript
```

## Dokumentasi API
Setelah aplikasi berjalan, Anda dapat mengakses Swagger UI di:
`http://localhost:3000/swagger`
