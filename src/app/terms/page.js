import Header from "@/components/start/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - TestIQ",
  description: "Terms of Service for TestIQ - Our terms and conditions",
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              By accessing and using TestIQ (&ldquo;the Service&rdquo;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              TestIQ provides online IQ testing services, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Numerical reasoning tests</li>
              <li>Verbal intelligence tests</li>
              <li>Memory and recall tests</li>
              <li>Comprehensive IQ assessments</li>
              <li>Score tracking and history</li>
              <li>Leaderboards and rankings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              3. User Accounts
            </h2>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              3.1 Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To use our Service, you must create an account by providing:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>A unique username</li>
              <li>A valid email address</li>
              <li>A secure password</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              3.2 Account Security
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              4. Use of Service
            </h2>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              4.1 Acceptable Use
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Use the Service for any fraudulent or unlawful purpose</li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service</li>
              <li>Share test questions or answers</li>
              <li>Create multiple accounts to manipulate scores</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              4.2 Test Rules
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              When taking tests, you must:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Complete tests independently without assistance</li>
              <li>Not use external resources or tools</li>
              <li>Wait 24 hours between attempts of the same test</li>
              <li>Not share or distribute test content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All content on TestIQ, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Test questions and answers</li>
              <li>Graphics, logos, and designs</li>
              <li>Text and written content</li>
              <li>Software and code</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              is owned by TestIQ or its licensors and is protected by
              intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              6. Privacy and Data Protection
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your use of our Service is also governed by our{" "}
              <Link
                href="/privacy-policy"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Privacy Policy
              </Link>
              . By using TestIQ, you consent to our collection and use of data
              as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, either express or
              implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Accuracy of test results</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To the maximum extent permitted by law, TestIQ shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Your use or inability to use the Service</li>
              <li>Any errors or omissions in the Service</li>
              <li>Unauthorized access to your data</li>
              <li>Loss of data or profits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              9. Modification of Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Modify or discontinue the Service at any time</li>
              <li>Change features or functionality</li>
              <li>Impose limits on certain features</li>
              <li>Restrict access to parts of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              10. Termination
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may terminate or suspend your account immediately, without
              prior notice, for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Breach of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Harmful conduct towards other users</li>
              <li>Violation of intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which TestIQ operates, without
              regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We reserve the right to update these Terms at any time. We will
              notify users of any material changes by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Posting the new Terms on this page</li>
              <li>Updating the &ldquo;Last updated&rdquo; date</li>
              <li>Sending an email notification for major changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              13. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about these Terms, please contact us:
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

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              14. Severability
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary so that these Terms shall otherwise
              remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              15. Entire Agreement
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These Terms constitute the entire agreement between you and TestIQ
              regarding the use of the Service, superseding any prior
              agreements.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
