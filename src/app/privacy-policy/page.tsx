import { cookies } from 'next/headers';

import { getLanguageFromCookies } from '@/lib/i18n/locale';
import { UI_MESSAGES } from '@/lib/i18n/messages';

export const metadata = {
  title: 'Privacy Policy',
};

export default async function PrivacyPolicyPage() {
  const language = getLanguageFromCookies(await cookies());
  const t = UI_MESSAGES[language];

  return (
    <div className="container mx-auto px-4 py-10">
      <article className="prose prose-slate max-w-3xl dark:prose-invert">
        <h1>{t.privacyPolicy}</h1>

        {language === 'fr' ? (
          <>
            <p>
              Cette politique explique comment SEQHER collecte, utilise et protège vos informations lorsque vous visitez
              notre site.
            </p>
            <h2>Données que nous collectons</h2>
            <ul>
              <li>Informations que vous envoyez via nos formulaires (nom, email, message).</li>
              <li>Données techniques de base (adresse IP, type de navigateur) à des fins de sécurité et de performance.</li>
              <li>Cookies nécessaires au fonctionnement du site (préférences de région et de langue).</li>
            </ul>
            <h2>Utilisation</h2>
            <ul>
              <li>Répondre aux demandes et gérer les rendez-vous/volontariat.</li>
              <li>Améliorer le site et détecter les abus.</li>
            </ul>
            <h2>Vos choix</h2>
            <p>
              Vous pouvez supprimer les cookies dans votre navigateur. Certains réglages (région/langue) devront alors
              être reconfigurés.
            </p>
            <h2>Contact</h2>
            <p>
              Pour toute question: <a href="mailto:info@seqher.org">info@seqher.org</a>
            </p>
          </>
        ) : (
          <>
            <p>
              This policy explains how SEQHER collects, uses, and protects your information when you use our website.
            </p>
            <h2>Information we collect</h2>
            <ul>
              <li>Information you submit via our forms (name, email, message).</li>
              <li>Basic technical data (IP address, browser type) for security and performance.</li>
              <li>Cookies required for core functionality (region and language preferences).</li>
            </ul>
            <h2>How we use it</h2>
            <ul>
              <li>Respond to inquiries and manage appointments/volunteer requests.</li>
              <li>Improve the site and detect abuse.</li>
            </ul>
            <h2>Your choices</h2>
            <p>
              You can clear cookies in your browser. If you do, some preferences (region/language) may need to be set
              again.
            </p>
            <h2>Contact</h2>
            <p>
              Questions: <a href="mailto:info@seqher.org">info@seqher.org</a>
            </p>
          </>
        )}
      </article>
    </div>
  );
}
