import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Josh Osborne',
  description: 'Privacy Policy for Josh Osborne tools and applications.',
}

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: 12 March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-300 leading-relaxed">This Privacy Policy explains how Josh Osborne ("I", "me") collects, uses, and protects information when you use tools and applications available at josho.pro and related domains.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information Collected</h2>
        <p className="text-gray-300 leading-relaxed mb-3">I may collect the following types of information:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Information you provide directly (e.g. contact forms, account creation)</li>
          <li>Usage data (pages visited, features used) collected anonymously</li>
          <li>Technical data (browser type, IP address) for security and performance</li>
          <li>OAuth tokens from third-party platforms when you authorise integrations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How Information Is Used</h2>
        <p className="text-gray-300 leading-relaxed">Information is used solely to operate and improve the Service. I do not sell, rent, or share personal data with third parties for marketing purposes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Integrations</h2>
        <p className="text-gray-300 leading-relaxed">When you connect third-party accounts (TikTok, YouTube, Google, etc.), those platforms may share access tokens or profile data with the Service solely to enable the requested functionality. This data is stored securely and used only for the authorised purpose.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
        <p className="text-gray-300 leading-relaxed">Personal data is retained only as long as necessary to provide the Service. You may request deletion of your data at any time by contacting me.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Security</h2>
        <p className="text-gray-300 leading-relaxed">I implement reasonable technical and organisational measures to protect your data. No system is completely secure; I cannot guarantee absolute security.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
        <p className="text-gray-300 leading-relaxed">You have the right to access, correct, or delete your personal data. To exercise these rights, contact: <a href="mailto:josh@josho.pro" className="text-blue-400 underline">josh@josho.pro</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
        <p className="text-gray-300 leading-relaxed">This policy may be updated periodically. The date at the top of this page reflects the most recent revision. Continued use of the Service constitutes acceptance.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
        <p className="text-gray-300 leading-relaxed">Questions about this policy: <a href="mailto:josh@josho.pro" className="text-blue-400 underline">josh@josho.pro</a></p>
      </section>
    </main>
  )
}
