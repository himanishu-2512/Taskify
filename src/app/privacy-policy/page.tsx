"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <header className="border-b p-6">
          <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
        </header>
        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-700">Introduction</h2>
            <p className="text-gray-600">
              Welcome to our Privacy Policy. Your privacy is critically important to us. This policy explains how we collect, use, and safeguard your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">Information We Collect</h2>
            <p className="text-gray-600">
              We collect personal information such as your name, email address, and any other details you provide when you sign up for our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">How We Use Your Data</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To provide and improve our services.</li>
              <li>To send you updates and promotional material.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, update, or delete your personal data. Contact us if you wish to exercise these rights.
            </p>
          </section>

          <footer className="text-sm text-gray-500">
            Last updated on: November 24, 2024
          </footer>
        </div>
      </div>
    </div>
  );
}
