import React from "react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms of Service",
  description:
    "Read Notevo's Terms of Service to understand the rules and guidelines for using our note-taking platform. Learn about account management, liability, and user responsibilities.",
  path: "/terms-of-service",
  keywords: ["terms of service", "user agreement", "legal terms", "service terms"],
});

export default function page() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <div className="flex-grow">
        <MaxWContainer>
          <section className="py-20 px-5">
            <h1 className="text-4xl font-bold py-5">Notevo Terms of Service</h1>
            <h2 className="text-2xl font-semibold mt-8">Liability</h2>
            <p>
              Our commitment to providing this service is founded on the
              principles of transparency and user responsibility. It is
              important to understand the following regarding liability:
            </p>
            <h3 className="text-xl font-medium mt-6">
              No Warranty or Guarantee
            </h3>
            <p>
              We provide this service &quot;as-is&quot; and without any warranty
              or guarantee. While we make every effort to ensure the
              functionality, security, and reliability of our platform, we do
              not make any representations or warranties regarding the accuracy,
              completeness, or suitability of the information and materials
              found or offered on this platform.
            </p>
            <h3 className="text-xl font-medium mt-6">Exclusion of Liability</h3>
            <p>
              In no event shall Notevo be liable for any direct, indirect,
              incidental, consequential, special, or exemplary damages,
              including but not limited to, damages for loss of profits,
              goodwill, use, data, or other intangible losses, resulting from
              the use or inability to use our services.
            </p>
            <h3 className="text-xl font-medium mt-6">User Responsibility</h3>
            <p>
              You acknowledge and agree that your use of this service is at your
              own risk. We are not responsible for any damages or issues that
              may arise, including but not limited to, data loss, system errors,
              or interruptions in service. It is your responsibility to take
              appropriate precautions and ensure that any services or
              information obtained through our platform meet your specific
              requirements.
            </p>
            <h3 className="text-xl font-medium mt-6">Indemnification</h3>
            <p>
              By using our service, you agree to indemnify and hold Notevo
              harmless from any claims, actions, damages, liabilities, costs,
              and expenses, including reasonable attorneys&apos; fees, arising
              out of or in connection with your use of the service or any
              violation of these terms.
            </p>
            <p>
              If you do not agree with any part of these terms, your only
              recourse is to discontinue your use of the service.
            </p>
            <h2 className="text-2xl font-semibold mt-8">Account</h2>
            <h3 className="text-xl font-medium mt-6">Account Management</h3>
            <p>
              We reserve the right to manage your account at our discretion.
              This includes the right to delete, suspend, or lock your account
              and associated data without prior notice for reasons including,
              but not limited to, violation of our terms of service, suspected
              fraudulent activities, or any actions that compromise the security
              and integrity of our platform.
            </p>
            <h3 className="text-xl font-medium mt-6">Termination</h3>
            <p>
              We may terminate or suspend your account for any reason, including
              breach of these terms. In the event of termination, you will no
              longer have access to your account and any data associated with
              it. Notevo is not liable for any loss or damage that may result
              from the termination of your account.
            </p>
            <h3 className="text-xl font-medium mt-6">Account Security</h3>
            <p>
              It is your responsibility to maintain the security of your account
              credentials. You agree not to share your login information with
              third parties. You are solely responsible for any activities that
              occur under your account.
            </p>
            <h3 className="text-xl font-medium mt-6">Account Data</h3>
            <p>
              You can delete your account and all associated data at any time by
              going to your account settings page and deleting your account.
              Once your account is deleted, there is no way to recover your
              data.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Uptime, Security, and Privacy
            </h2>
            <h3 className="text-xl font-medium mt-6">Uptime</h3>
            <p>
              {`
                    While we strive to maintain the availability of our services, we
                    do not provide any service level agreement (SLA). The website's
                    uptime may be subject to occasional interruptions, including
                    maintenance, updates, or unforeseen technical issues.
                    `}
            </p>
            <h3 className="text-xl font-medium mt-6">Security</h3>
            <p>
              We implement reasonable security measures to protect the integrity
              of our platform. However, you acknowledge that no online service
              can be completely secure. We do not assume responsibility for any
              unauthorized access, data breaches, or other security incidents.
            </p>
            <h3 className="text-xl font-medium mt-6">Privacy</h3>
            <p>
              Your privacy is important to us. Our privacy practices are
              outlined in our separate{" "}
              <a href="/privacy-policy">Privacy Policy</a>, which is an integral
              part of these terms. By using our services, you agree to the
              collection, use, and disclosure of your information as described
              in the Privacy Policy.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Copyright and Content Ownership
            </h2>
            <h3 className="text-xl font-medium mt-6">
              Ownership of Generated Content
            </h3>
            <p>
              We do not claim any rights to the content generated within Notevo.
              The content you create remains your intellectual property.
            </p>
            <h3 className="text-xl font-medium mt-6">Developer Protection</h3>
            <p>
              By using our service, you acknowledge that developers working on
              Notevo may explore and improve features conceptually similar to
              content generated within the platform. However, we respect user
              privacy and ownership rights.
            </p>
            <h2 className="text-2xl font-semibold mt-8">Features and Bugs</h2>
            <h3 className="text-xl font-medium mt-6">Continuous Improvement</h3>
            <p>
              We are dedicated to continuously adding new features and improving
              functionalities to enhance your experience. By agreeing to our
              terms, you acknowledge that the system may undergo changes over
              time.
            </p>
            <h3 className="text-xl font-medium mt-6">Bug Fixes</h3>
            <p>
              Bugs are an inevitable part of any software system. While we
              strive to maintain a seamless experience, you understand that bugs
              may be identified and fixed as part of our ongoing development
              efforts.
            </p>
            <h3 className="text-xl font-medium mt-6">
              Impact on User Experience
            </h3>
            <p>
              Changes to the system, including the introduction of new features
              or bug fixes, may impact your overall experience. By agreeing to
              our terms, you accept that such changes are inherent in the nature
              of software development.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Use of AI and Third-Party Services
            </h2>
            <h3 className="text-xl font-medium mt-6">Third-Party Services</h3>
            <p>
              We utilize third-party services for authentication and artificial
              intelligence-powered features. These third-party services operate
              independently, and we are not responsible for their operations,
              performance, or any consequences arising from their use.
            </p>
            <h3 className="text-xl font-medium mt-6">No Affiliation</h3>
            <p>
              We are not affiliated with the third-party AI services we employ.
              Any issues or concerns related to these services should be
              directed to the respective third-party providers.
            </p>
            <h3 className="text-xl font-medium mt-6">User Responsibility</h3>
            <p>
              By using our service, you agree that it is your responsibility to
              familiarize yourself with the laws of your own country concerning
              the use of AI-generated content. Compliance with local laws and
              regulations is essential.
            </p>
            <h3 className="text-xl font-medium mt-6">Continuous Improvement</h3>
            <p>
              AI systems are continually evolving. We appreciate your feedback
              in enhancing the quality of AI-powered features on Notevo.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Updates to Terms of Service
            </h2>
            <h3 className="text-xl font-medium mt-6">Right to Update</h3>
            <p>
              We reserve the right to update these terms of service at any time.
              Updates may be made to reflect changes in our services, legal
              requirements, or other considerations.
            </p>
            <h3 className="text-xl font-medium mt-6">
              No Obligation to Notify
            </h3>
            <p>
              While we may make efforts to communicate significant changes, we
              are not obligated to notify users individually when updates occur.
              It is your responsibility to check back on these terms
              periodically.
            </p>
            <h3 className="text-xl font-medium mt-6">Review of Terms</h3>
            <p>
              {`
                    It's advisable to review these terms regularly to ensure that you
                    are aware of any changes that may affect your use of Notevo. Your
                    continued use of the service after updates indicates your
                    agreement to be bound by the modified terms.
                    `}
            </p>
            <p className="py-10">
              <strong>Last Modified: 3/6/2025</strong>
            </p>
          </section>
        </MaxWContainer>
      </div>
    </div>
  );
}
