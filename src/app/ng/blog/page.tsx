'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { BlogPost } from '@/lib/types';
import { useFirebase } from '@/context/FirebaseContext';
import { collection, getDocs, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const blogHeroImage = PlaceHolderImages.find(p => p.id === 'blog-hero');

// Nigerian-focused blog posts for seeding
const localBlogPostsData: Omit<BlogPost, 'id' | 'createdAt'>[] = [
    {
        title: "Empowering Lagos Youth: Our New Digital Skills Program",
        slug: "lagos-youth-digital-skills-program",
        content: "SEQHER Nigeria is thrilled to launch a new digital skills program aimed at empowering young people in Lagos. This initiative will provide free training in web development, digital marketing, and graphic design, opening up new career pathways and fostering economic independence. In partnership with local tech hubs, we aim to train over 500 youths in the first year, directly contributing to SDG 8 (Decent Work and Economic Growth).",
        author: "Admin User",
        authorId: "admin-placeholder-uid",
        imageId: "program-education"
    },
    {
        title: "Sustainable Farming Initiative Takes Root in Rural Oyo State",
        slug: "sustainable-farming-oyo-state",
        content: "Our latest project in Oyo State focuses on promoting sustainable agricultural practices among smallholder farmers. By introducing techniques like drip irrigation and organic composting, we are helping communities increase their crop yields, improve food security (SDG 2), and build resilience against climate change. The program has already seen a 40% increase in harvest for participating families.",
        author: "Admin User",
        authorId: "admin-placeholder-uid",
        imageId: "program-sustainability"
    },
    {
        title: "Clean Water for All: A Community-Led Project in Rivers State",
        slug: "clean-water-rivers-state",
        content: "Access to clean water is a fundamental human right. In collaboration with community leaders in Rivers State, SEQHER has successfully installed three new borehole wells, providing safe drinking water to over 5,000 residents. This project addresses SDG 6 (Clean Water and Sanitation) and has significantly reduced the incidence of waterborne diseases in the area.",
        author: "Admin User",
        authorId: "admin-placeholder-uid",
        imageId: "program-water"
    }
];


export default function BlogPage() {
    const { db } = useFirebase();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        async function seedBlogData() {
            const blogQuery = query(collection(db, 'blogPosts'));
            const snapshot = await getDocs(blogQuery);
            if (snapshot.empty) {
                console.log('Seeding blog data...');
                const batch = writeBatch(db);
                localBlogPostsData.forEach(postData => {
                    const newRef = doc(collection(db, 'blogPosts'));
                    batch.set(newRef, {
                        ...postData,
                        id: newRef.id,
                        createdAt: new Date().toISOString(),
                    });
                });
                await batch.commit();
                console.log('Blog data seeded successfully.');
                return true;
            }
            return false;
        }

        async function getBlogPosts(): Promise<BlogPost[]> {
            const postsQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
            const postsSnapshot = await getDocs(postsQuery);
            const postsList = postsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt, // Assumes createdAt is already an ISO string
                } as BlogPost;
            });
            return postsList;
        }

        async function loadBlog() {
            setLoading(true);
            await seedBlogData();
            const posts = await getBlogPosts();
            setBlogPosts(posts);
            setLoading(false);
        }

        loadBlog();

    }, [db]);


  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {blogHeroImage && (
          <Image
            src={blogHeroImage.imageUrl}
            alt={blogHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={blogHeroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">SEQHER Blog - Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Stories of impact, community voices, and organizational updates.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="p-0">
                           <Skeleton className="w-full h-48" />
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col flex-grow">
                             <Skeleton className="h-6 w-3/4 mb-4" />
                             <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-2/3" />
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                     <Skeleton className="h-4 w-24" />
                                     <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          )}
          {!loading && blogPosts.length === 0 && (
             <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-bold font-headline mb-4">No Posts Yet</h2>
                <p>There are no blog posts available at the moment. Check back soon!</p>
            </div>
          )}
          {!loading && blogPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => {
                const postImage = PlaceHolderImages.find((p) => p.id === post.imageId);
                const authorAvatar = PlaceHolderImages.find(p => p.id.startsWith('avatar-'));

                return (
                    <Link key={post.id} href={`/ng/blog/${post.slug}`} className="group">
                    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="p-0">
                        {postImage && (
                            <Image
                            src={postImage.imageUrl}
                            alt={post.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover"
                            data-ai-hint={postImage.imageHint}
                            />
                        )}
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col flex-grow">
                        <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                        <p className="text-muted-foreground line-clamp-3 flex-grow">{post.content}</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                            <Avatar>
                            {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} />}
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="text-sm font-medium">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    </Link>
                );
                })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
