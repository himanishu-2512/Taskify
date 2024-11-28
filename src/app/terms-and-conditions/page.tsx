"use client";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <header className="border-b p-6">
          <h1 className="text-3xl font-bold text-gray-800">Terms & Conditions</h1>
        </header>
        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-700">Introduction</h2>
            <p className="text-gray-600">
              These Terms & Conditions govern your use of our website and services. By accessing or using our platform, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must provide accurate information when signing up.</li>
              <li>You must not misuse our services or violate any laws.</li>
              <li>You are responsible for safeguarding your account information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">Limitation of Liability</h2>
            <p className="text-gray-600">
              We are not liable for any damages arising from your use of our services beyond what is permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700">Governing Law</h2>
            <p className="text-gray-600">
              These terms are governed by the laws of [Your Country/State], without regard to conflict of law principles.
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
