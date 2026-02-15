'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Music2, Twitter } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const pathname = usePathname();
  const isCanada = pathname.startsWith('/ca');
  const { messages } = useLanguage();
  const canadaOfficeAddress = '2121 Weston Rd, Toronto, ON, Canada M4P 0E6';
  const nigeriaOfficeAddress = 'Pompomari Bypass Opp Meltdew Gas Station, Maiduguri, Borno State, Nigeria.';
  const primaryOfficeLabel = isCanada ? 'Canada' : 'Nigeria';
  const primaryOfficeAddress = isCanada ? canadaOfficeAddress : nigeriaOfficeAddress;
  const secondaryOfficeLabel = isCanada ? 'Nigeria' : 'Canada';
  const secondaryOfficeAddress = isCanada ? nigeriaOfficeAddress : canadaOfficeAddress;

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: 'https://www.facebook.com/share/18rF2QiaNY/' },
    { name: 'X (Twitter)', icon: <Twitter className="h-5 w-5" />, href: 'https://x.com/Seqherinitiativ?t=OY1j8i25QLbZckBzOpbxqw&s=09' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: 'https://www.instagram.com/seqherinitiativ?igsh=MTlzdHJsdXFnenkzcg==' },
    {
      name: 'TikTok',
      icon: <Music2 className="h-5 w-5" />,
      href: 'https://www.tiktok.com/@seqherinitiativ?_r=1&_d=edl9hl31fc8mj0&sec_uid=MS4wLjABAAAAOUJqf4RL6vpml8RkbvyzjpmZT99c8gXMzeJ9SUwacCOeGFaTVWErudFaSlvjP8oj&share_author_id=7377005085425452037&sharer_language=en&source=h5_m&u_code=eee8b92m37m0f2&timestamp=1765958944&user_id=7377005085425452037&sec_user_id=MS4wLjABAAAAOUJqf4RL6vpml8RkbvyzjpmZT99c8gXMzeJ9SUwacCOeGFaTVWErudFaSlvjP8oj&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7576955429353604865&share_link_id=50963718-d4d1-496d-864f-445ab9a11474&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1',
    },
  ];

  const footerLinks = isCanada
    ? [
        { title: messages.aboutUs, href: '/ca#purpose' },
        { title: messages.services, href: '/ca#navigation' },
        { title: messages.projects, href: '/ca#projects' },
        { title: messages.internationalNews, href: '/ca/news' },
      ]
    : [
        { title: messages.aboutUs, href: '/ng/about' },
        { title: messages.people, href: '/ng/people' },
        { title: messages.services, href: '/ng/programs' },
        { title: messages.projects, href: '/ng/projects' },
        { title: messages.newsStories, href: '/ng/news' },
        { title: messages.grants, href: '/ng/grants' },
      ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <span className="font-bold text-2xl font-headline">SEQHER</span>
            </Link>
            <p className="text-muted-foreground">Empowering communities and fostering sustainable development in alignment with global goals.</p>
            <div className="rounded-lg border border-border/50 bg-background/20 p-3 text-xs">
              <p className="font-semibold text-foreground">{primaryOfficeLabel} Office Address</p>
              <p className="mt-2 text-muted-foreground">
                {primaryOfficeAddress}
              </p>
              <p className="mt-3 font-semibold text-foreground">{secondaryOfficeLabel} Office Address</p>
              <p className="mt-2 text-muted-foreground">
                {secondaryOfficeAddress}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">{messages.quickLinks}</h3>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                  <li key={link.href}>
                      <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                          {link.title}
                      </Link>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">{messages.getInvolved}</h3>
           <ul className="space-y-2">
               <li>
                    <Link
                      href={isCanada ? '/ca/donate' : '/ng/donate'}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {messages.donate}
                    </Link>
                </li>
                <li>
                    <Link
                      href={isCanada ? '/ca/volunteer' : '/ng/volunteer'}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {messages.volunteer}
                    </Link>
                </li>
                <li>
                    <Link
                      href={isCanada ? '/ca/appointment' : '/ng/appointment?location=Nigeria'}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {messages.bookAppointment}
                    </Link>
                </li>
            </ul>
          </div>

	          <div>
	             <h3 className="font-semibold font-headline text-lg mb-4">{messages.connectWithUs}</h3>
	            <div className="flex space-x-4">
	                {socialLinks.map((social) => (
	                <Button key={social.name} variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/10">
	                    <a href={social.href} aria-label={social.name} target="_blank" rel="noreferrer">
	                        {social.icon}
	                    </a>
	                </Button>
	                ))}
	            </div>
	            <p className="mt-4 text-muted-foreground text-sm">
	              <a className="hover:text-primary transition-colors" href="mailto:info@seqher.org">
	                info@seqher.org
	              </a>
	            </p>
              {!isCanada && (
                <>
                  <p className="text-muted-foreground text-sm">
                    <a className="hover:text-primary transition-colors" href="tel:+2348064454657">
                      +234 806 445 4657
                    </a>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <a className="hover:text-primary transition-colors" href="tel:+2349020484873">
                      +234 902 048 4873
                    </a>
                  </p>
                </>
              )}
	          </div>
	        </div>
        
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SEQHER. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary">{messages.privacyPolicy}</Link>
            <Link href="/terms-of-service" className="hover:text-primary">{messages.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
