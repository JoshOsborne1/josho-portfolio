import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Josh Osborne',
  description: 'Terms of Service for Josh Osborne tools and applications.',
}

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: 12 March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-300 leading-relaxed">By accessing or using any tools, applications, or content created by Josh Osborne (referred to as "the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Use of the Service</h2>
        <p className="text-gray-300 leading-relaxed">You may use the Service for lawful purposes only. You agree not to use the Service to transmit harmful, offensive, or unlawful content, to attempt to gain unauthorised access to any systems, or to interfere with the operation of the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
        <p className="text-gray-300 leading-relaxed">All content, code, and materials provided through the Service are the intellectual property of Josh Osborne unless otherwise stated. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
        <p className="text-gray-300 leading-relaxed">The Service may integrate with third-party platforms such as TikTok, YouTube, Instagram, and others. Your use of those platforms is governed by their respective terms of service. Josh Osborne is not responsible for third-party platform policies or actions.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Disclaimer of Warranties</h2>
        <p className="text-gray-300 leading-relaxed">The Service is provided "as is" without warranties of any kind, express or implied. Josh Osborne makes no guarantees regarding uptime, accuracy, or fitness for a particular purpose.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
        <p className="text-gray-300 leading-relaxed">To the fullest extent permitted by law, Josh Osborne shall not be liable for any indirect, incidental, or consequential damages arising from use of the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
        <p className="text-gray-300 leading-relaxed">These terms may be updated at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
        <p className="text-gray-300 leading-relaxed">For questions regarding these terms, contact: <a href="mailto:josh@josho.pro" className="text-blue-400 underline">josh@josho.pro</a></p>
      </section>
    </main>
  )
}
