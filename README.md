# Society for Equal Health and Rights (SEQHER) — Digital Hub

## Organization

**SOCIETY FOR EQUAL HEALTH AND RIGHTS (SEQHER)**

- **Mission:** Advancing a better world by closing the gaps of inequality through education, economic empowerment, human rights, gender and social justice, health and wellbeing, food security, inclusivity and cultural connections.
- **Vision:** A society where equality thrives.
- **Motto:** Igniting Actions that drive change.

**Offices**

- **Headquarter:** Behind Monday Lodge, Shagari Low-cost Jere, Maiduguri, Borno State, Nigeria.
- **Abuja Office:** A1 Akaton Homes, Plot 822 Durumi District, Abuja, Nigeria.
- **Kogi Office:** Beside El Bethel Gbeganu, Kogi State, Nigeria.

**Contact**

- **Contact person:** Omeiza Segun Samuel (Executive Director)
- **Telephone:** +2348064454657, +2349020484873
- **Email:** Samsegun01@gmail.com
- **Website:** https://seqher.org
- **Social:** Facebook/Instagram/X: @Seqherinitiativ

## Project

This is a Next.js website for SEQHER. The platform is built with:
- **Firebase** - Authentication and user management
- **Supabase** - Admin database for blogs, news, programs, announcements, and appointments
- **Tailwind CSS** - UI styling
- **Genkit AI** - AI-powered features

## Architecture

### Frontend
- Next.js App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components

### Backend
- **Authentication**: Firebase Auth
- **Admin Database**: Supabase PostgreSQL
  - Blog Posts, News Articles, Programs, Announcements, Appointments
- **Server Actions**: Next.js server-side functions for secure operations

### Database Structure
- **blogPosts** - Blog articles with author and publish metadata
- **news** - News articles with categorization
- **programs** - Program information with SDG goal tracking
- **announcements** - Site announcements
- **appointments** - Appointment requests from users

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Environment Variables
```bash
# Firebase (Authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Supabase (Admin Database)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Installation
```bash
npm install
npm run dev
```

Visit http://localhost:9002 to see the application.

## Supabase Integration

This project uses Supabase for secure admin data management. For detailed setup instructions, see:
- [Setup Guide](docs/SUPABASE_SETUP.md)
- [Quick Reference](docs/SUPABASE_QUICK_REF.md)
- [Data Reading Guide](docs/SUPABASE_READING.md)
- [Migration Checklist](docs/MIGRATION_CHECKLIST.md)

## Available Scripts

- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linting
- `npm run typecheck` - Type check
- `npm run genkit:dev` - Start Genkit AI development
- `npm run genkit:watch` - Watch Genkit AI files

## Project Structure

```
src/
├── app/                    # Next.js pages and layouts
│   ├── admin/             # Admin dashboard pages
│   ├── appointment/       # Appointment booking
│   ├── ng/                # Public pages
│   └── ca/                # Locale-specific pages
├── components/            # React components
│   ├── layout/           # Header, Footer components
│   ├── ui/               # Radix UI components
│   └── icons/            # Icon components
├── lib/                   # Utilities and clients
│   ├── firebase.ts       # Firebase config
│   ├── supabase-admin.ts # Supabase admin client
│   ├── supabase-client.ts # Supabase client
│   └── types.ts          # TypeScript types
├── context/              # React context (Auth, Firebase)
├── hooks/                # Custom React hooks
└── ai/                   # Genkit AI flows
```
