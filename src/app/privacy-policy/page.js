import Header from "@/components/start/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - TestIQ",
  description: "Privacy Policy for TestIQ - Learn how we handle your data",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              TestIQ (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
              is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our IQ testing service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.1 Personal Information
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Username (chosen by you)</li>
              <li>Email address</li>
              <li>Age (optional)</li>
              <li>Country (optional)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.2 Test Data
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Test results and scores</li>
              <li>Time taken to complete tests</li>
              <li>Answers to test questions</li>
              <li>Test completion history</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.3 Technical Information
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>IP address (anonymized)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use the collected information for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Providing and improving our IQ testing services</li>
              <li>Creating and managing your account</li>
              <li>Tracking your test progress and history</li>
              <li>Generating leaderboards and rankings</li>
              <li>Analyzing test performance and improving test quality</li>
              <li>Communicating with you about our services</li>
              <li>Ensuring security and preventing fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We do not sell, trade, or rent your personal information. We may
              share information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In anonymized form for research purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We implement appropriate technical and organizational measures to
              protect your data:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure password hashing</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Regular backups</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Maintain your session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve our services</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For more information, see our{" "}
              <Link
                href="/cookie-policy"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              8. Data Retention
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We retain your data only as long as necessary:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Account data: Until account deletion</li>
              <li>Test results: Indefinitely for historical tracking</li>
              <li>Technical logs: 90 days</li>
              <li>Session data: 7 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our service is not intended for children under 13. We do not
              knowingly collect data from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may update this policy periodically. We will notify you of any
              material changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: razvan.bordinc@yahoo.com
              <br />
              Website:{" "}
              <a
                href="https://bordincrazvan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                bordincrazvan.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
