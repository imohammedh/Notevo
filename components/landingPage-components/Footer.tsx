import Link from "next/link";
import NotevoLogo from "@/public/Notevo-logo.svg";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="w-full rounded-t-xl text-brand_tertiary py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/">
              <Image
                src={NotevoLogo}
                alt="Notevo logo"
                className=" pb-2 hover:opacity-50"
                width={50}
                height={50}
              />
            </Link>
            <h2 className="text-2xl font-bold">Notevo</h2>
            <p className="mt-2 text-gray-400">Notes to the Next Level.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Notevo</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>
                <Link href="/#How_To_Start" className="hover:underline">
                  How To Start
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:underline">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mt-4 text-lg font-semibold">Legal</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-start text-gray-500 text-sm">
          <hr className=" border-brand_tertiary/10 py-5" />©{" "}
          {new Date().getFullYear()} Notevo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
