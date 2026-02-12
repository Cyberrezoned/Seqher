import { cookies } from 'next/headers';

import { getLanguageFromCookies } from '@/lib/i18n/locale';
import { UI_MESSAGES } from '@/lib/i18n/messages';

export const metadata = {
  title: 'Terms of Service',
};

export default async function TermsOfServicePage() {
  const language = getLanguageFromCookies(await cookies());
  const t = UI_MESSAGES[language];

  return (
    <div className="container mx-auto px-4 py-10">
      <article className="prose prose-slate max-w-3xl dark:prose-invert">
        <h1>{t.termsOfService}</h1>

        {language === 'fr' ? (
          <>
            <p>En utilisant ce site, vous acceptez les présentes conditions.</p>
            <h2>Utilisation du site</h2>
            <ul>
              <li>Ne pas tenter d’accéder de manière non autorisée à nos systèmes.</li>
              <li>Ne pas perturber le fonctionnement du site ou publier du contenu illégal.</li>
            </ul>
            <h2>Contenu et informations</h2>
            <p>
              Le contenu est fourni à titre informatif. SEQHER peut mettre à jour le site à tout moment.
            </p>
            <h2>Contact</h2>
            <p>
              Questions: <a href="mailto:info@seqher.org">info@seqher.org</a>
            </p>
          </>
        ) : (
          <>
            <p>By using this website, you agree to these terms.</p>
            <h2>Site use</h2>
            <ul>
              <li>Do not attempt unauthorized access to our systems.</li>
              <li>Do not disrupt the website or submit unlawful content.</li>
            </ul>
            <h2>Content and information</h2>
            <p>The site content is provided for informational purposes. SEQHER may update the site at any time.</p>
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
