
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowRight, Globe } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

// One-time data seeding
const newArticlesData: Omit<NewsArticle, 'id'>[] = [
    { title: "UN Launches 'Decade of Action' to Accelerate Sustainable Development", source: "UN News", publishedDate: "2024-10-24", summary: "The United Nations has kicked off its 'Decade of Action,' a global effort to mobilize financing, enhance national implementation, and strengthen institutions to achieve the Sustainable Development Goals by 2030.", imageId: "news-sdg-report", link: "#", category: "Sustainability" },
    { title: "Global Carbon Emissions Reach New High, Urgent Action Needed", source: "WMO", publishedDate: "2024-11-15", summary: "A new report from the World Meteorological Organization shows that greenhouse gas concentrations reached a new record last year, making the need for rapid and deep emissions cuts more critical than ever.", imageId: "news-climate-report", link: "#", category: "Climate Action" },
    { title: "WHO Announces Breakthrough in Malaria Vaccine Trials", source: "WHO News", publishedDate: "2025-01-20", summary: "The World Health Organization has reported promising results from Phase 3 trials of a new malaria vaccine, offering hope to millions at risk from the deadly disease, especially children in Africa.", imageId: "news-health-innovation", link: "#", category: "Global Health" },
    { title: "UNESCO Summit Focuses on Bridging the Digital Divide in Education", source: "UNESCO", publishedDate: "2024-12-05", summary: "Education leaders from around the world gathered to address the digital divide, calling for increased investment in infrastructure and digital literacy to ensure equitable learning opportunities for all.", imageId: "news-education-summit", link: "#", category: "Education" },
    { title: "International Court of Justice Expands Role in Environmental Disputes", source: "ICJ Press", publishedDate: "2025-02-10", summary: "The ICJ has adopted new guidelines to better handle cases related to environmental protection and transboundary harm, strengthening the legal framework for international peace and ecological justice.", imageId: "news-peace-justice", link: "#", category: "Peace and Justice" },
    { title: "World Bank Pledges $50 Billion for Clean Energy Projects in Developing Nations", source: "World Bank", publishedDate: "2024-11-28", summary: "The World Bank Group announced a major funding initiative to support the transition to renewable energy in developing countries, aiming to foster economic growth and combat climate change.", imageId: "news-affordable-clean-energy", link: "#", category: "Economic Growth" },
    { title: "FAO Report: Sustainable Agriculture Key to Ending Global Hunger", source: "FAO", publishedDate: "2024-10-16", summary: "The Food and Agriculture Organization's latest report highlights the critical role of sustainable farming practices in ensuring food security and nutrition for a growing global population.", imageId: "news-zero-hunger", link: "#", category: "Sustainability" },
    { title: "UNICEF Report Shows Progress in Reducing Child Mortality Rates", source: "UNICEF", publishedDate: "2025-01-12", summary: "A new report from UNICEF indicates a significant decline in global child mortality rates over the past two decades, but warns that more effort is needed to protect the most vulnerable children.", imageId: "news-good-health", link: "#", category: "Global Health" },
    { title: "New UN Treaty to Protect Biodiversity on the High Seas Enters into Force", source: "UN News", publishedDate: "2025-03-01", summary: "The historic High Seas Treaty has officially come into effect, creating a new framework for conserving marine life and managing activities in international waters.", imageId: "news-life-below-water", link: "#", category: "Climate Action" },
    { title: "ILO Conference Addresses the Future of Work and Decent Employment", source: "ILO News", publishedDate: "2024-12-18", summary: "The International Labour Organization is hosting a global summit to discuss the challenges of automation and the gig economy, aiming to promote decent work and economic security for all.", imageId: "news-decent-work", link: "#", category: "Economic Growth" },
    { title: "UN Women Calls for Urgent Action to End Gender-Based Violence", source: "UN Women", publishedDate: "2024-11-25", summary: "On the International Day for the Elimination of Violence against Women, UN Women launched a new campaign to galvanize global action and funding to end this widespread human rights violation.", imageId: "news-gender-equality", link: "#", category: "Peace and Justice" },
    { title: "UNDP Report: Reducing Inequality is Crucial for Global Stability", source: "UNDP", publishedDate: "2025-02-20", summary: "The United Nations Development Programme's latest Human Development Report argues that tackling economic and social inequalities is fundamental to building peaceful and resilient societies.", imageId: "news-reduced-inequalities", link: "#", category: "Peace and Justice" },
    { title: "UN-Habitat Assembly Focuses on Sustainable Urban Development", source: "UN-Habitat", publishedDate: "2024-10-31", summary: "City leaders and urban planners are meeting to discuss innovative solutions for creating greener, more inclusive, and resilient cities in the face of rapid urbanization and climate change.", imageId: "news-sustainable-cities", link: "#", category: "Sustainability" },
    { title: "G7 Leaders Commit to New Partnership for Global Infrastructure and Investment", source: "G7 Press", publishedDate: "2024-11-10", summary: "Leaders from the G7 nations have announced a new partnership aimed at mobilizing private capital to fund infrastructure projects in developing countries, fostering sustainable economic growth.", imageId: "news-partnerships-for-goals", link: "#", category: "Economic Growth" },
    { title: "IPCC Synthesis Report: A Final Warning on the Climate Crisis", source: "IPCC", publishedDate: "2025-03-15", summary: "The Intergovernmental Panel on Climate Change has released its final synthesis report, stating that the world has a brief and rapidly closing window to secure a liveable and sustainable future for all.", imageId: "news-climate-report", link: "#", category: "Climate Action" },
    { title: "WHO and Partners Launch New Global Initiative to Combat Noncommunicable Diseases", source: "WHO News", publishedDate: "2024-12-01", summary: "A new global collaboration aims to reduce mortality from noncommunicable diseases like heart disease, cancer, and diabetes through prevention and improved access to care.", imageId: "news-health-innovation", link: "#", category: "Global Health" },
    { title: "Global Fund Replenishment Conference Raises Record Pledges", source: "The Global Fund", publishedDate: "2024-09-21", summary: "Donors have pledged a record amount to the Global Fund to fight AIDS, Tuberculosis, and Malaria, providing critical resources to save millions of lives.", imageId: "news-good-health", link: "#", category: "Global Health" },
    { title: "UNHCR Reports Record Levels of Global Displacement", source: "UNHCR", publishedDate: "2024-06-20", summary: "The UN Refugee Agency's annual report reveals that the number of people forced to flee their homes due to conflict, violence, and persecution has reached an all-time high.", imageId: "news-peace-justice", link: "#", category: "Peace and Justice" },
    { title: "ITU Report Highlights Progress and Gaps in Global Internet Connectivity", source: "ITU News", publishedDate: "2024-09-15", summary: "The International Telecommunication Union reports that while more people are online than ever, significant efforts are still needed to connect the remaining 2.6 billion people, especially in rural areas.", imageId: "news-digital-inclusion", link: "#", category: "Education" },
    { title: "COP29 Concludes with New Agreement on Climate Finance", source: "UNFCCC", publishedDate: "2024-11-22", summary: "The latest UN Climate Change Conference has concluded with a landmark agreement on a new collective quantified goal for climate finance, aiming to support developing countries in their climate actions.", imageId: "news-partnerships-for-goals", link: "#", category: "Climate Action" }
  ];

async function seedNewsData() {
    const newsQuery = query(collection(db, 'news'));
    const snapshot = await getDocs(newsQuery);
    // Only seed if the collection is empty
    if (snapshot.empty) {
        console.log('Seeding news data...');
        const batch = writeBatch(db);
        newArticlesData.forEach(articleData => {
            const newRef = doc(collection(db, 'news'));
            batch.set(newRef, {
                ...articleData,
                id: newRef.id,
            });
        });
        await batch.commit();
        console.log('News data seeded successfully.');
        // Return true to indicate seeding happened
        return true;
    }
    // Return false if no seeding was done
    return false;
}


async function getNewsArticles(): Promise<NewsArticle[]> {
  const newsQuery = query(collection(db, 'news'), orderBy('publishedDate', 'desc'));
  const snapshot = await getDocs(newsQuery);
  const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate().toISOString() : new Date().toISOString(),
      } as NewsArticle
  });
  return list;
}


const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

export default function NewsPage() {
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNews() {
            setLoading(true);
            const seeded = await seedNewsData();
            const articles = await getNewsArticles();
            setNewsArticles(articles);
            setLoading(false);
        }
        loadNews();
    }, []);

  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {newsHeroImage && (
          <Image
            src={newsHeroImage.imageUrl}
            alt={newsHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={newsHeroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <motion.div 
            className="relative z-10 text-center text-white p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="font-headline text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            >
                Global News & Activities
            </motion.h1>
          <motion.p 
            className="mt-2 max-w-2xl text-lg text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            >
            The latest updates on the Sustainable Development Goals from around the world.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? Array.from({length: 6}).map((_, index) => (
                <Card key={index} className="flex flex-col h-full w-full overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="w-full h-48 bg-muted animate-pulse" />
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="h-4 bg-muted w-1/3 mb-4 animate-pulse" />
                        <div className="h-6 bg-muted w-full mb-2 animate-pulse" />
                        <div className="h-6 bg-muted w-3/4 mb-4 animate-pulse" />
                        <div className="h-4 bg-muted w-full mt-2 animate-pulse" />
                        <div className="h-4 bg-muted w-full mt-2 animate-pulse" />
                        <div className="h-4 bg-muted w-1/2 mt-2 animate-pulse" />
                    </CardContent>
                     <CardFooter className="p-6 pt-0 mt-auto">
                        <div className="h-5 bg-muted w-24 animate-pulse" />
                    </CardFooter>
                </Card>
            ))
            : newsArticles.map((article, index) => {
               const articleImage = PlaceHolderImages.find((p) => p.id === article.imageId);
               return (
              <motion.div
                key={article.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="h-full flex"
                >
                <Card className="flex flex-col h-full w-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <CardHeader className="p-0 relative">
                    {articleImage && (
                        <Image
                        src={articleImage.imageUrl}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                        data-ai-hint={articleImage.imageHint}
                        />
                    )}
                    <Badge className="absolute top-2 right-2" variant="secondary">{article.category}</Badge>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">
                      {article.source} &middot; {format(new Date(article.publishedDate), 'MMM d, yyyy')}
                    </p>
                    <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">{article.summary}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 mt-auto">
                    <Link href={article.link} className="flex items-center text-primary font-semibold" target="_blank" rel="noopener noreferrer">
                      Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )})}
          </div>
           {!loading && newsArticles.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No news articles found. Check back later!
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
