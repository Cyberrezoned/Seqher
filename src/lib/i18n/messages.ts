import type { Language } from '@/lib/i18n/language';

export type UiMessages = {
  home: string;
  ourProjects: string;
  chooseCountry: string;
  nigeria: string;
  canada: string;
  aboutUs: string;
  getInvolved: string;
  volunteer: string;
  bookAppointment: string;
  careers: string;
  donate: string;
  updates: string;
  language: string;
  english: string;
  french: string;
  quickLinks: string;
  services: string;
  projects: string;
  internationalNews: string;
  people: string;
  newsStories: string;
  grants: string;
  connectWithUs: string;
  privacyPolicy: string;
  termsOfService: string;
};

export const UI_MESSAGES: Record<Language, UiMessages> = {
  en: {
    home: 'Home',
    ourProjects: 'Our Projects',
    chooseCountry: 'Choose a country',
    nigeria: 'Nigeria',
    canada: 'Canada',
    aboutUs: 'About Us',
    getInvolved: 'Get Involved',
    volunteer: 'Volunteer',
    bookAppointment: 'Book Appointment',
    careers: 'Careers',
    donate: 'Donate',
    updates: 'Updates',
    language: 'Language',
    english: 'English',
    french: 'Français',
    quickLinks: 'Quick Links',
    services: 'Services',
    projects: 'Projects',
    internationalNews: 'International News',
    people: 'People',
    newsStories: 'News & Stories',
    grants: 'Grants',
    connectWithUs: 'Connect With Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  fr: {
    home: 'Accueil',
    ourProjects: 'Nos projets',
    chooseCountry: 'Choisir un pays',
    nigeria: 'Nigéria',
    canada: 'Canada',
    aboutUs: 'À propos',
    getInvolved: 'S’impliquer',
    volunteer: 'Bénévolat',
    bookAppointment: 'Prendre rendez-vous',
    careers: 'Carrières',
    donate: 'Faire un don',
    updates: 'Actualités',
    language: 'Langue',
    english: 'English',
    french: 'Français',
    quickLinks: 'Liens rapides',
    services: 'Services',
    projects: 'Projets',
    internationalNews: 'Nouvelles internationales',
    people: 'Équipe',
    newsStories: 'Nouvelles & récits',
    grants: 'Subventions',
    connectWithUs: 'Nous joindre',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: "Conditions d'utilisation",
  },
};

