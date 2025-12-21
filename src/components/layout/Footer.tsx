import Link from 'next/link';
import { Facebook, Instagram, Music2, Twitter } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';

export default function Footer() {
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

  const footerLinks = [
      { title: 'About Us', href: '/ng/about' },
      { title: 'Programs', href: '/ng/programs' },
      { title: 'Blog', href: '/ng/blog' },
      { title: 'News', href: '/ng/news' },
  ]

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
          </div>
          
          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">Quick Links</h3>
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
            <h3 className="font-semibold font-headline text-lg mb-4">Get Involved</h3>
            <ul className="space-y-2">
               <li>
                    <Link href="/ng/donate" className="text-muted-foreground hover:text-primary transition-colors">
                        Donate
                    </Link>
                </li>
                <li>
                    <Link href="/ng/appointment" className="text-muted-foreground hover:text-primary transition-colors">
                        Volunteer
                    </Link>
                </li>
            </ul>
          </div>

	          <div>
	             <h3 className="font-semibold font-headline text-lg mb-4">Connect With Us</h3>
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
	          </div>
	        </div>
        
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SEQHER. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
