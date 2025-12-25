import React from "react";
import MaxWContainer from "@/src/components/ui/MaxWContainer";
import { generateMetadata as generateSEOMetadata } from "@/src/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description:
    "Read Notevo's Privacy Policy to understand how we collect, use, and protect your personal information. Learn about our data practices and your privacy rights.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "GDPR", "user privacy"],
});

export default function page() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <div className="flex-grow">
        <MaxWContainer>
          <section className="py-20 px-5">
            <h1 className="text-4xl font-bold py-5">Notevo Privacy Policy</h1>
            <p className="text-lg leading-relaxed">
              Notevo (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              provides this Privacy Policy to inform you of our policies and
              procedures regarding the collection, use, and disclosure of
              personal information we may receive from users of our website
              (&quot;Site&quot;), accessible from https://notevo.me/ , and any
              other services offered by us in connection with our Site (any and
              all of the foregoing, the &quot;Services&quot;).
            </p>
            <p>
              If you have additional questions or require more information about
              our Privacy Policy, do not hesitate to contact us at
              support@notevo.me. This Privacy Policy applies only to our online
              activities and is valid for visitors to our website with regards
              to the information that they share and/or collect in Notevo. This
              policy is not applicable to any information collected offline or
              via channels other than this website.
            </p>
            <h2 className="text-2xl font-semibold mt-8">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Information We Collect
            </h2>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you sign up, we
                collect your name, email, and profile picture from your Google
                account. We use this information for personalization and
                essential communication with you. We never sell your data.
              </li>
              <li>
                <strong>Voluntary Correspondence:</strong> We retain questions
                or assistance requests, including your email, for future
                reference.
              </li>
              <li>
                <strong>Marketing Communications:</strong> Your email may be
                used for direct marketing and support. You can unsubscribe
                anytime, and we will promptly delete your information upon
                request.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8">Your Data</h2>
            <p>
              Deleted data may remain in our database while your account is
              active. When you delete your account, all of your data is removed
              from our database. Retrieving data from backups is impractical.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Links to Other Sites
            </h2>
            <p>
              Our services may contain links to other websites, applications,
              and online services. If you choose to visit a third-party service
              or click on a third-party link, you will be directed to that third
              party&apos;s website, application, or online service. The fact
              that we link to a website or content is not an endorsement,
              authorization, or representation of our affiliation with that
              third party, nor is it an endorsement of their privacy or
              information security policies or practices. We do not exercise
              control over third-party websites or services.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              Third-Party Privacy Policies
            </h2>
            <p>
              Our Privacy Policy does not apply to other websites. Thus, we
              advise you to consult the respective Privacy Policies of these
              third-party services for more detailed information. This may
              include their practices and instructions on how to opt-out of
              certain options.
            </p>
            <p>
              {`
                    You can choose to disable cookies through your individual browser
                    settings. More detailed information about cookie management with
                    specific web browsers can be found on the browsers' respective
                    websites.
                    `}
            </p>
            <h2 className="text-2xl font-semibold mt-8">Cookies</h2>
            <p>
              Cookies are small pieces of data stored on your device by your
              browser. They serve various purposes, such as remembering your
              preferences, enhancing user experience, and facilitating
              authentication.
            </p>
            <p>
              At our Site, we utilize third-party authentication services,
              including Google OAuth, to secure and streamline the login
              process. When you log in using Google OAuth, a cookie is generated
              and stored on your device. This cookie is essential for the proper
              functioning of our authentication system.
            </p>
            <p>
              The Google OAuth cookie contains a unique identifier that helps us
              recognize your authenticated session. It enables you to access our
              application seamlessly without needing to re-enter your
              credentials repeatedly during a single session.
            </p>
            <p>
              These cookies do not store personal information directly on our
              servers. Instead, they serve as tokens that establish a secure
              connection between your browser and the authentication provider,
              in this case, Google. This enhances the security of the
              authentication process while providing a more user-friendly
              experience.
            </p>
            <p>
              By using our Site and opting for third-party authentication, you
              consent to the use of cookies for authentication purposes. You can
              manage your cookie preferences through your browser settings.
            </p>
            <h2 className="text-2xl font-semibold mt-8">
              GDPR Data Protection Rights
            </h2>
            <p>
              We want to ensure that you are fully aware of all of your data
              protection rights. Every user is entitled to the following:
            </p>
            <ul>
              <li>
                <strong>The right to access:</strong> You have the right to
                request copies of your personal data. We may charge you a small
                fee for this service.
              </li>
              <li>
                <strong>The right to rectification:</strong> You have the right
                to request that we correct any information you believe is
                inaccurate. You also have the right to request that we complete
                any information you believe is incomplete.
              </li>
              <li>
                <strong>The right to erasure:</strong> You have the right to
                request that we erase your personal data, under certain
                conditions.
              </li>
              <li>
                <strong>The right to restrict processing:</strong> You have the
                right to request that we restrict the processing of your
                personal data, under certain conditions.
              </li>
              <li>
                <strong>The right to object to processing:</strong> You have the
                right to object to our processing of your personal data, under
                certain conditions.
              </li>
              <li>
                <strong>The right to data portability:</strong> You have the
                right to request that we transfer the data we have collected to
                another organization, or directly to you, under certain
                conditions.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8">
              Changes to This Privacy Policy
            </h2>
            <p>
              This Privacy Policy may be revised periodically, and this will be
              reflected by a &quot;Last modified&quot; date below. We advise you
              to review this page periodically for any changes. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              These changes are effective immediately upon posting.
            </p>
            <p className="py-10">
              <strong>Last Modified:</strong> 12/02/2025
            </p>
          </section>
        </MaxWContainer>
      </div>
    </div>
  );
}
