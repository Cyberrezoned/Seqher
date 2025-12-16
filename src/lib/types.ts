export type Program = {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageId: string;
  sdgGoals: number[];
  locale: 'ng' | 'ca' | 'global';
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string; // ISO string
  imageId: string;
  locale: 'ng' | 'ca' | 'global';
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  locale: 'ng' | 'ca' | 'global';
  createdAt: string; // ISO string
};

export type AppointmentRequest = {
    id: string;
    name: string;
    email: string;
    appointmentDate: string; // ISO string
    appointmentType: 'volunteering' | 'partnership' | 'general';
    message?: string;
    createdAt: string; // ISO string
    status: 'pending' | 'confirmed' | 'cancelled';
}

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  publishedDate: string; // ISO string
  summary: string;
  imageId: string;
  link: string;
  category: 'Climate Action' | 'Global Health' | 'Education' | 'Economic Growth' | 'Peace and Justice' | 'Sustainability';
  locale: 'ng' | 'ca' | 'global';
};

export type UserProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  locale?: 'ng' | 'ca' | 'global';
  // raw Supabase user object, if needed
  metadata?: Record<string, any>;
};

export type AppUser = UserProfile;
