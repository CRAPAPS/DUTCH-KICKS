import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dutch Kicks',
  description: 'How Dutch Kicks collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <LegalHeader title="Privacy Policy" updated="1 May 2025" />

        <Section title="1. Who We Are">
          <p>Dutch Kicks (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website dutchkicks.com and conducts live resale commerce via the Whatnot platform. We are committed to protecting your personal information and your right to privacy.</p>
          <p>For any privacy-related questions, contact us at <a href="mailto:sales@dutchkicks.com" className="text-gold hover:underline">sales@dutchkicks.com</a>.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you provide directly to us and information collected automatically when you use our site.</p>
          <Subhead>Information you provide</Subhead>
          <ul>
            <li>Email address and name when you contact us or subscribe to updates</li>
            <li>Purchase and bidding information when transacting via Whatnot</li>
          </ul>
          <Subhead>Information collected automatically</Subhead>
          <ul>
            <li>Browser type, device information, and IP address</li>
            <li>Pages visited, time spent, and referring URLs</li>
            <li>Session data via Supabase authentication (if you create an account)</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li>To operate, maintain, and improve the Dutch Kicks platform</li>
            <li>To process and fulfil orders placed via Whatnot</li>
            <li>To send transactional emails related to your purchases</li>
            <li>To send promotional communications where you have opted in</li>
            <li>To detect and prevent fraud and unauthorised access</li>
          </ul>
        </Section>

        <Section title="4. Third-Party Services">
          <p>We share data with the following trusted third parties solely to operate our service:</p>
          <ul>
            <li><strong className="text-white/80">Whatnot</strong> — our live commerce sales platform. Transactions, shipping, and buyer data are governed by Whatnot&apos;s own privacy policy.</li>
            <li><strong className="text-white/80">Supabase</strong> — database and authentication infrastructure. Data is stored on servers within the EU/US region.</li>
            <li><strong className="text-white/80">Hostinger</strong> — web hosting and server infrastructure.</li>
            <li><strong className="text-white/80">Anthropic (Claude API)</strong> — powers our automated listing and pricing tools. No personal buyer data is transmitted to Anthropic.</li>
          </ul>
          <p>We do not sell your personal information to any third party.</p>
        </Section>

        <Section title="5. Cookies">
          <p>We use essential cookies required for the site to function (session management, authentication state). We do not use third-party advertising cookies. You may disable cookies in your browser settings; however, some site features may not function correctly.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your personal data only for as long as necessary to provide our services and comply with legal obligations. Account data is deleted upon request. Transaction records may be retained for up to 7 years for tax and accounting purposes.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:sales@dutchkicks.com" className="text-gold hover:underline">sales@dutchkicks.com</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="8. Security">
          <p>We implement industry-standard security measures including HTTPS encryption, row-level database security (Supabase RLS), and strict access controls. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="9. Children">
          <p>Our platform is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal data, contact us immediately.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. The &quot;Last Updated&quot; date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </Section>
      </div>
    </div>
  )
}

function LegalHeader({ title, updated }: { title: string; updated: string }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-3">Legal</p>
      <h1 className="font-display font-black text-4xl text-gradient-gold uppercase tracking-tight">{title}</h1>
      <p className="text-white/30 font-mono text-sm mt-3">Last updated: {updated}</p>
      <div className="mt-6 h-px bg-gradient-to-r from-gold/40 to-transparent" />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-black text-xl text-white/90 uppercase tracking-wide mb-4">{title}</h2>
      <div className="space-y-3 text-white/50 text-sm font-mono leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_strong]:text-white/70">
        {children}
      </div>
    </section>
  )
}

function Subhead({ children }: { children: React.ReactNode }) {
  return <p className="text-white/70 font-bold mt-4 mb-1">{children}</p>
}
