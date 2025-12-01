import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
  Hr,
  Button,
} from "@react-email/components";

export default function VerificationCodeEmail({
  code,
  expires,
}: {
  code: string;
  expires: Date;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <div className="bg-gray-50 py-12">
          <Container className="bg-white max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden">
            {/* Header with Logo and Brand */}
            <Section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-center">
              <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
                    fill="#6366F1"
                  />
                </svg>
              </div>
              <Heading className="text-white text-3xl font-bold m-0 tracking-tight">
                Notevo
              </Heading>
              <Text className="text-blue-100 text-sm m-0 mt-2">
                Secure Email Verification
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-8 py-8">
              <Heading className="text-2xl font-bold text-gray-800 mb-4 mt-0">
                Sign in to Notevo
              </Heading>
              
              <Text className="text-gray-600 text-base leading-relaxed mb-6">
                Please enter the following code on the sign in page.
              </Text>

              {/* Code Display Box */}
              <Section className="text-center my-8">
                <Text className="text-gray-700 text-sm font-semibold uppercase tracking-wider mb-3 m-0">
                  Verification code
                </Text>
                <Text className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-widest my-4 font-mono">
                  {code}
                </Text>
                <Text className="text-gray-600 text-sm">
                  (This code is valid for{" "}
                  {Math.floor((+expires - Date.now()) / (60 * 60 * 1000))} hours)
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <Text className="text-gray-500 text-xs text-center leading-relaxed m-0">
                © 2025-2026 Notevo. All rights reserved.
              </Text>
            </Section>
          </Container>
        </div>
      </Tailwind>
    </Html>
  );
}