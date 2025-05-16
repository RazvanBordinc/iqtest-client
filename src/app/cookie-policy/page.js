import Header from "@/components/start/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cookie Policy - TestIQ",
  description: "Cookie Policy for TestIQ - Learn how we use cookies",
};

export default function CookiePolicy() {
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
          Cookie Policy
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and understanding how
              you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              TestIQ uses cookies for the following purposes:
            </p>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.1 Essential Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These cookies are necessary for the website to function properly.
              They include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>
                <strong>authToken</strong>: Maintains your login session
              </li>
              <li>
                <strong>refreshToken</strong>: Allows automatic session renewal
              </li>
              <li>
                <strong>theme</strong>: Remembers your light/dark mode
                preference
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.2 Functional Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These cookies enhance your experience by remembering your choices:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>
                <strong>testHistory</strong>: Stores your test completion
                history locally
              </li>
              <li>
                <strong>userPreferences</strong>: Remembers your UI preferences
              </li>
              <li>
                <strong>cookieConsent</strong>: Records your cookie consent
                choices
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              2.3 Performance Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These cookies help us understand how visitors interact with our
              website:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Anonymous usage statistics</li>
              <li>Performance metrics</li>
              <li>Error tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              3. Cookie Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-2 border-b text-left text-gray-700 dark:text-gray-300">
                      Cookie Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-gray-700 dark:text-gray-300">
                      Purpose
                    </th>
                    <th className="px-4 py-2 border-b text-left text-gray-700 dark:text-gray-300">
                      Duration
                    </th>
                    <th className="px-4 py-2 border-b text-left text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      authToken
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Authentication
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      15 minutes
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Essential
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      refreshToken
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Session renewal
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      7 days
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Essential
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      theme
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Theme preference
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      1 year
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Functional
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      cookieConsent
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Cookie preferences
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      1 year
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Essential
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              4. Third-Party Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We do not use any third-party cookies or tracking services. All
              cookies are first-party cookies set by TestIQ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              5. Managing Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You can control and manage cookies in several ways:
            </p>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              5.1 Cookie Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use our cookie consent banner to accept or reject optional cookies
              when you first visit our site.
            </p>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              5.2 Browser Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>View and delete cookies</li>
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear cookies when you close the browser</li>
              <li>Accept cookies from specific websites</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
              5.3 Consequences of Disabling Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you disable essential cookies:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>You won&apos;t be able to log in to your account</li>
              <li>Test sessions may not function properly</li>
              <li>Your preferences won&apos;t be remembered</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              6. Local Storage
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              In addition to cookies, we use local storage for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>Caching test questions for offline access</li>
              <li>Storing test progress temporarily</li>
              <li>Maintaining UI state</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7. Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may update this Cookie Policy from time to time. We will notify
              you of any changes by updating the &ldquo;Last updated&rdquo; date
              at the top of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              8. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about our use of cookies, please contact us:
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
              9. Learn More
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For more information about cookies and how to manage them, visit:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  www.allaboutcookies.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.youronlinechoices.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  www.youronlinechoices.eu
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
