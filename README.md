# FunMind Quiz - Interactive Learning Platform

> **Proyek Test Interview** - Aplikasi Kuis Interaktif menggunakan React/Next.js 16

Sebuah aplikasi kuis interaktif dengan tema cartoon yang menyenangkan, dibangun menggunakan Next.js 16, React 19, dan Supabase untuk autentikasi.

## 📋 Persyaratan Proyek & Implementasi

Berikut adalah pemetaan antara kriteria yang diminta dengan implementasi dalam proyek:

| No  | Kriteria                  | Status | Implementasi                                                              |
| --- | ------------------------- | ------ | ------------------------------------------------------------------------- |
| 1.a | Fitur Login               | ✅     | Login dengan Email/Password + Google OAuth (Supabase Auth)                |
| 1.b | API dari OpenTDB          | ✅     | Terintegrasi dengan `https://opentdb.com/` API                            |
| 1.c | Jumlah & Tipe Soal Bebas  | ✅     | 5/10/15/20 soal, Multiple Choice & True/False, berbagai kategori          |
| 1.d | Tampilan Total & Progress | ✅     | Header menampilkan "Question X/Y" + Progress Bar visual                   |
| 1.e | Timer                     | ✅     | Timer countdown dengan durasi dinamis (3-15 menit tergantung jumlah soal) |
| 1.f | Satu Soal per Halaman     | ✅     | Auto-advance setelah jawaban dipilih (1.5 detik delay)                    |
| 1.g | Hasil Pengerjaan          | ✅     | Modal menampilkan benar/salah/persentase + earned XP                      |
| 1.h | Resume Mechanism          | ✅     | LocalStorage dengan modal konfirmasi resume + auto-save setiap 5 detik    |
| 1.i | Upload ke GitHub          | ✅     | [Repository Link]                                                         |

### ⭐ Fitur Tambahan (Bonus)

- **XP System**: Gamifikasi dengan level & XP berdasarkan difficulty
- **Quiz History**: Riwayat semua quiz yang pernah dikerjakan
- **Responsive Design**: Mobile-first, support tablet & desktop
- **Auto-Save Multi-Layer**: `beforeunload`, `visibilitychange`, `pagehide`, `blur`/`focus` events
- **Smart Pause**: Timer otomatis pause saat tab tidak aktif (mobile/desktop)
- **Multiple Categories**: 20+ kategori dari OpenTDB (Science, History, Sports, dll)
- **Difficulty Selection**: Easy, Medium, Hard
- **Quiz Stats Dashboard**: Total quiz, accuracy, favorite category
- **Session Expiry**: Auto-delete session setelah 24 jam

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16.1.12 (App Router)
- **React**: 19.0.0
- **Styling**: TailwindCSS + Custom Cartoon Theme
- **Font**: Quicksand (Google Fonts)
- **Icons**: Material Symbols Rounded

### Backend & Services

- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Database**: Supabase PostgreSQL
- **Quiz API**: OpenTDB (Open Trivia Database)
- **Storage**: LocalStorage for XP, History, Session Resume

### Development Tools

- **Runtime**: Bun (Package Manager)
- **Bundler**: Turbopack (Next.js 16 default)
- **Code Quality**: Prettier + prettier-plugin-tailwindcss
- **Language**: JavaScript (ES6+)

## 📦 Instalasi & Setup

### 1. Clone Repository

```bash
git clone [your-repo-url]
cd quiz_dot_intern
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Variables

Buat file `.env.local` dengan konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Catatan**: Untuk production, set `NEXT_PUBLIC_SITE_URL` ke domain Vercel Anda.

### 4. Setup Database (Supabase)

Jalankan migrasi berikut di Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Setup Google OAuth (Opsional)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat OAuth 2.0 Client ID
3. Tambahkan Authorized Redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.vercel.app/auth/callback` (production)
4. Copy Client ID & Secret ke Supabase Authentication Settings

### 6. Jalankan Development Server

```bash
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🎮 Cara Menggunakan Aplikasi

### 1. Authentication

- **Sign Up**: Buat akun baru dengan email/password atau Google
- **Login**: Masuk dengan kredensial yang sudah dibuat
- Verifikasi email diperlukan untuk login dengan email/password

### 2. Dashboard

- Pilih kategori quiz dari 3 kategori yang ditampilkan
- Klik "View All" untuk melihat semua 20+ kategori
- Klik "Random Quiz" untuk quiz acak

### 3. Quiz Settings

- **Difficulty**: Easy, Medium, Hard
- **Number of Questions**: 5, 10, 15, atau 20 soal
- **Type**: Otomatis (Multiple Choice & True/False sesuai API)

### 4. Playing Quiz

- Baca soal di speech bubble
- Pilih jawaban (A/B/C/D atau True/False)
- Jawaban benar = hijau, salah = merah
- Auto-advance ke soal berikutnya setelah 1.5 detik
- Timer berjalan untuk semua soal (tidak reset per soal)

### 5. Resume Feature

- Tutup browser saat quiz berlangsung
- Buka kembali, pilih kategori yang sama
- Modal resume akan muncul dengan info:
  - Progress (Question X of Y)
  - Current Score
  - Waktu tersisa
- Pilih "Continue Quiz" untuk melanjutkan atau "Start Fresh"

### 6. Results

- Lihat skor akhir (benar/salah/persentase)
- XP yang didapat (berdasarkan difficulty × correct answers)
- "Back to Home" atau "Play Again"

### 7. History

- Akses dari sidebar atau mobile menu
- Lihat riwayat semua quiz
- Filter by category, difficulty, type
- Clear history jika diperlukan

## 📁 Struktur Proyek

```
quiz_dot_intern/
├── src/
│   ├── app/
│   │   ├── auth/           # Auth callback & error pages
│   │   ├── dashboard/      # Dashboard page & components
│   │   ├── history/        # Quiz history page
│   │   ├── login/          # Login page & actions
│   │   ├── quiz/
│   │   │   ├── play/       # Quiz game (main logic)
│   │   │   │   ├── components.tsx  # UI components
│   │   │   │   ├── use-quiz.ts     # Quiz logic hook
│   │   │   │   └── page.tsx        # Main page
│   │   │   └── select/     # Category selection
│   │   └── layout.tsx      # Root layout
│   ├── components/ui/      # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & libraries
│   │   ├── quiz-history.ts # History management
│   │   ├── quiz-session.ts # Resume mechanism
│   │   ├── xp-system.ts    # XP & leveling
│   │   └── supabase/       # Supabase client/server
│   └── utils/              # Helper functions
├── public/assets/          # Images & static files
├── .env.local              # Environment variables (gitignored)
└── package.json            # Dependencies
```

## 🔑 Fitur Utama & Implementasi

### 1. Authentication System (`src/app/login/`)

- **Email/Password**: Supabase Auth dengan validasi
- **Google OAuth**: One-click login
- **Profile Sync**: Auto-create profile di database
- **Protected Routes**: Middleware redirect untuk auth

**File Penting**:

- `actions.ts`: Server actions untuk login/signup
- `login-form.tsx`: Form dengan validasi

### 2. Quiz Engine (`src/app/quiz/play/use-quiz.ts`)

- **API Integration**: Fetch dari OpenTDB dengan retry logic
- **Timer Management**: Countdown dengan pause saat page hidden
- **State Management**: React hooks untuk quiz state
- **Auto-Save**: Multiple event listeners untuk reliability

**Mekanisme Resume**:

```javascript
// Save di 4 kondisi:
1. beforeunload - Desktop, tutup tab
2. visibilitychange - Mobile/Desktop, switch app
3. pagehide - iOS Safari, lebih reliable
4. blur/focus - Tap outside browser
5. Periodic save - Setiap 5 detik
```

### 3. XP System (`src/lib/xp-system.ts`)

- **Dynamic Leveling**: XP required increases per level
- **Difficulty Multiplier**:
  - Easy: 10 XP/soal
  - Medium: 20 XP/soal
  - Hard: 30 XP/soal
- **Real-time Updates**: Custom events + `useSyncExternalStore`

### 4. History Tracking (`src/lib/quiz-history.ts`)

- **Auto-save**: After quiz completion
- **Statistics**: Total, accuracy, favorite category
- **LocalStorage**: Max 50 items, auto-trim
- **Time Format**: Relative ("2 hours ago") & absolute

### 5. Responsive Design

- **Mobile-first**: Tailwind breakpoints (sm/md/lg)
- **Touch-friendly**: Large buttons, adequate spacing
- **Mobile Menu**: Overlay navigation
- **Adaptive Layouts**: Grid/Flexbox responsive

## 🎨 Design System

### Colors

- **Primary (Accent)**: `#facc15` (Yellow)
- **Background**: `#e0f5ea` (Light Green)
- **Text**: `#000000` (Black)
- **Borders**: `3px solid black` (Cartoon style)

### Shadows

- **Neo-brutalism**: `shadow-[4px_4px_0_#000]`
- **Hover**: `shadow-[6px_6px_0_#000]`

### Components

- Rounded corners: `rounded-2xl`, `rounded-3xl`, `rounded-4xl`
- Bold fonts: `font-bold`, `font-black`
- Material Icons: `material-symbols-rounded`

## 🐛 Troubleshooting

### Issue: Resume tidak muncul

**Solusi**:

- Pastikan localStorage tidak disabled
- Cek Console untuk error
- Session otomatis expire setelah 24 jam

### Issue: Timer tidak pause di mobile

**Solusi**: Sudah dihandle dengan multiple events, pastikan browser support `visibilitychange`

### Issue: Google OAuth redirect ke localhost

**Solusi**:

- Set `NEXT_PUBLIC_SITE_URL` di Vercel env vars
- Update redirect URLs di Supabase & Google Console

### Issue: Questions tidak load

**Solusi**:

- Cek koneksi internet
- OpenTDB mungkin rate-limited (retry otomatis)
- Cek Console Network tab

## 📊 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox (Desktop & Mobile)
- ⚠️ Internet Explorer (Not Supported)

## 🚀 Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
4. Deploy!

### Update Supabase Redirect URLs

```
https://your-domain.vercel.app/auth/callback
```

## 📝 Testing Checklist

- [ ] Login dengan email/password
- [ ] Login dengan Google OAuth
- [ ] Pilih kategori & settings
- [ ] Play quiz sampai selesai
- [ ] Timer countdown & finish
- [ ] Resume quiz (tutup browser & buka lagi)
- [ ] View history
- [ ] Check XP increase
- [ ] Responsive di mobile
- [ ] Logout & re-login

## 👨‍💻 Developer

**Name**: [Ilham Ramadhan]  
**Email**: [ilhamztr016@gmail.com]  
**GitHub**: [iam-rmdhn](https://github.com/iam-rmdhn)

## 📄 License

This project is created for interview assessment purposes.

## 🙏 Acknowledgments

- **OpenTDB**: Quiz questions API
- **Supabase**: Authentication & Database
- **Next.js Team**: Amazing framework
- **Vercel**: Hosting platform

---

**Built with ❤️ using Next.js 16, React 19, and Supabase**
