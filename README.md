# 🧠 FunMind - Interactive Quiz Platform

FunMind is a modern, engaging, and dynamic quiz application designed to test and improve your knowledge across a wide variety of subjects. Built with **Next.js 16**, **TypeScript**, and **Supabase**, it features a gamified experience with an XP system, robust progress saving, and a clean, responsive UI.

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Key Features

- **🎮 Dynamic Quiz Engine**
  - Multiple categories (Entertainment, Science, History, etc.)
  - Adjustable difficulty levels (Easy, Medium, Hard)
  - Time-pressure modes with global timers adaptive to question count.

- **💾 Smart Resume System**
  - **Never lose progress:** Accidentally closed the tab? FunMind saves your exact state (current question, answers, timer) locally.
  - Seamlessly resume your quiz session exactly where you left off.

- **🏆 Gamification & XP System**
  - Earn XP based on correct answers and difficulty multipliers.
  - Level up your profile as you learn.
  - Real-time XP updates and animations.

- **🔐 Secure Authentication**
  - Powered by **Supabase Auth**.
  - Support for **Email/Password** registration and **Google OAuth**.
  - Intelligent username generation from Google profiles.
  - Robust error handling for rate limits and duplicate accounts.

- **📱 Fully Responsive Design**
  - Mobile-first approach using **Tailwind CSS**.
  - Beautiful, interactive UI with animations and "Glassmorphism" elements.
  - Optimized for phones, tablets, and desktops.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Icons:** Material Symbols Rounded
- **State Management:** React Hooks & Context
- **Package Manager:** [Bun](https://bun.sh/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm/yarn/pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/funmind-quiz.git
   cd funmind-quiz
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional: For production/Vercel deployment
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Database Setup**
   Run the included SQL migrations in your Supabase SQL Editor to verify the `profiles` table and triggers are set up correctly.
   _(See `supabase/migrations` folder)_

5. **Run the Development Server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── auth/            # Auth callback routes
│   │   ├── dashboard/       # Main user dashboard
│   │   ├── login/           # Login & Signup pages
│   │   └── quiz/            # Quiz game logic & components
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks (useAuth, etc.)
│   ├── lib/                 # Utilities, API calls, types
│   └── ...
├── public/                  # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Open Trivia DB](https://opentdb.com/)** for providing the quiz questions API.
- **Supabase** for the amazing backend infrastructure.
