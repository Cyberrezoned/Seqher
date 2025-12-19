export type AdminNewsPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageId: string | null;
  locale: 'ng' | 'ca' | 'global';
  createdAt: string;
  updatedAt?: string | null;
};

