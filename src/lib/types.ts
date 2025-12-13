import type { User } from 'firebase/auth';

export type Program = {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageId: string;
  sdgGoals: number[];
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
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
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
    status: 'pending' | 'contacted' | 'resolved';
}

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  publishedDate: string; // ISO string
  summary: string;
  imageUrl: string;
  imageHint: string;
  link: string;
};


export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
};

// This combines Firebase's User object with our custom UserProfile
export type AppUser = User & UserProfile;
