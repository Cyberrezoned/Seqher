import Image from 'next/image';

const heroImage = {
  src: 'https://sirpek.wordpress.com/wp-content/uploads/2025/10/gbv-officer-1.png?w=819',
  alt: 'SEQHER careers',
};

export default function CareersPage() {
  return (
    <div className="bg-background">
      <section className="relative h-[45vh] min-h-[320px] w-full bg-primary/15 flex items-center justify-center">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm">Join the Mission</p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-3">Careers at SEQHER</h1>
          <p className="mt-3 max-w-3xl mx-auto text-primary-foreground text-lg">
            Current opening: Laboratory Scientist — Borno State, Nigeria
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <article className="prose prose-lg max-w-none">
            <p><strong>TERMS OF REFERENCE</strong></p>
            <ul>
              <li><strong>Position Title:</strong> Laboratory Scientist</li>
              <li><strong>Location:</strong> Borno State, Nigeria</li>
              <li><strong>Contract Duration:</strong> 1 December 2025 – 30 April 2026 (6 months, with possibility of extension up to 18 MONTHS).</li>
              <li><strong>Release Date:</strong> Monday, October 27, 2025</li>
              <li><strong>Application Deadline:</strong> November 14, 2025</li>
            </ul>

            <p><strong>About SEQHER</strong></p>
            <p>The <em>Society for Equal Health and Rights (SEQHER)</em> works to advance health equity and human rights for KEY POPULATION people and other marginalized populations in Nigeria. We focus on improving access to HIV/AIDS services, gender justice, and community-led advocacy through research, partnerships, and inclusive program implementation.</p>

            <p><strong>Position Summary</strong></p>
            <p>SEQHER is seeking a <strong>Laboratory Scientist</strong> to perform high-quality, confidential diagnostic testing for the implementation of KEY POPULATION health and HIV/AIDS partnership programs in Borno State. The successful candidate will be responsible for conducting rapid tests, managing laboratory supplies, and ensuring the integrity of all lab processes in mobile and static settings.</p>
            <p>This role is <strong>based in Borno State</strong> for the duration of the contract and offers a strong opportunity for extension based on performance and funding availability.</p>

            <p><strong>Key Responsibilities</strong></p>
            <ul>
              <li>Perform rapid diagnostic tests (RDTs) for HIV, Syphilis, and other STIs in accordance with national guidelines and standard operating procedures.</li>
              <li>Ensure proper collection, handling, and disposal of all laboratory specimens.</li>
              <li>Maintain and calibrate laboratory equipment and ensure the "cold chain" is maintained for temperature-sensitive reagents.</li>
              <li>Accurately record all test results in project registers and support data entry into the M&amp;E system.</li>
              <li>Manage inventory of laboratory supplies (test kits, PPE, etc.) and alert the project manager in a timely manner to prevent stock-outs.</li>
              <li>Adhere to universal safety precautions and infection prevention control measures at all times.</li>
              <li>Work closely with the Medical Officer and peer navigators to ensure a smooth client flow and service delivery.</li>
              <li>Uphold SEQHER’s values of inclusion, diversity, and respect in all program engagements.</li>
            </ul>

            <p><strong>Required Qualifications and Experience</strong></p>
            <ul>
              <li>A bachelor's degree or Higher National Diploma (HND) in Medical Laboratory Science.</li>
              <li>Valid practicing license from the Medical Laboratory Science Council of Nigeria (MLSCN).</li>
              <li><strong>Understanding of HIV/AIDS programs implementation</strong> in Nigeria.</li>
              <li>Minimum of 2 years of verifiable post-NYSC experience in a laboratory setting, preferably involved in HIV/AIDS programming or public health.</li>
              <li>High proficiency in <strong>English and Nigerian Pidgin</strong>; working knowledge of <strong>Hausa</strong> and being a resident of <strong>Borno State</strong> is highly desirable.</li>
              <li>Strong attention to detail, organizational skills, and a commitment to maintaining strict confidentiality.</li>
              <li>Ability to work independently and as part of a multidisciplinary team.</li>
            </ul>

            <p><strong>Preferred Candidate Profile</strong></p>
            <ul>
              <li>An individual who <strong>identifies as part of the KEY POPULATION community</strong>, or an <strong>ALLY</strong> with a strong commitment to human rights, gender equality, and inclusion in Nigeria.</li>
              <li>A meticulous and ethical professional dedicated to providing accurate and dignified services.</li>
              <li>Resident in, or willing to relocate to, <strong>Borno State</strong> for the contract duration.</li>
            </ul>

            <p><strong>How to Apply</strong></p>
            <p>Interested applicants should submit: PLEASE, MERGE THEM INTO A <a href="https://www.ilovepdf.com/merge_pdf"><strong>PDF</strong></a> SINGLE DOCUMENT.</p>
            <ol>
              <li>A <strong>cover letter</strong> (max 1.5 pages) detailing relevant experience and motivation for applying.</li>
              <li>A <strong>current CV</strong> (max 5 pages).</li>
              <li>Copy of MLSCN practicing license.</li>
            </ol>
            <p>Applications should be sent by email to <a href="mailto:job@seqher.org"><em>job@seqher.org</em></a> and copy <a href="mailto:alfred@seqher.org"><em>alfred@seqher.org</em></a> with the subject line: <strong>“Laboratory Scientist – Borno”</strong></p>
            <p><strong>Only shortlisted candidates will be contacted.</strong></p>
            <p>Send questions and enquiries to: <em>Society for Equal Health and Rights</em></p>
            <p><a href="mailto:info@seqher.org"><em>info@seqher.org</em></a>; and copy <a href="mailto:seqher2020@gmail.com"><em>seqher2020@gmail.com</em></a></p>
          </article>
        </div>
      </section>
    </div>
  );
}
