import BlogClient, { type BlogListItem } from '@/app/ng/blog/BlogClient';
import { getStaticBlogPosts } from '@/lib/content/static';
import { makeExcerpt } from '@/lib/content/wp';

export const dynamic = 'force-static';

export default function BlogPage() {
  const posts = getStaticBlogPosts('ng').map(
    (post): BlogListItem => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: makeExcerpt(post.content, 180),
      imageId: post.imageId,
      imageUrl: post.imageUrl ?? null,
      author: post.author || 'Admin',
      createdAt: post.createdAt,
    })
  );

  return <BlogClient posts={posts} />;
}

