"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_NAME, NAV_LINKS, CONTACT_INFO } from "@/app/lib/constants";
import { createClient } from "@/app/lib/supabase/client";
import Container from "./Container";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState(CONTACT_INFO);

  // Fetch contact info from database
  useEffect(() => {
    async function loadContactInfo() {
      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_info')
          .single();

        if (data?.value) {
          setContactInfo(data.value);
        }
      } catch {
        // Use fallback from constants
      }
    }
    loadContactInfo();
  }, []);

  // Hide footer on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="bg-atlas-navy text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logos/Atlas Logo.jpg"
                alt={SITE_NAME}
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-lg font-bold font-heading">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-neutral-200">
              Building healthy habits through sport. Serving the Tri-Cities community with quality youth and adult sports programs.
            </p>
            {contactInfo.address && (
              <p className="text-xs text-neutral-300">
                🏠︎ {contactInfo.address}
              </p>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-200 hover:text-atlas-sky transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-heading">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.email && (
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-neutral-200 hover:text-atlas-sky transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo.phone && (
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                    className="text-sm text-neutral-200 hover:text-atlas-sky transition-colors flex items-center gap-2"
                  >
                    ☏ {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.address && (
                <li className="text-sm text-neutral-200 flex items-start gap-2">
                  🏠︎ {contactInfo.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-atlas-sky/20 text-center">
          <p className="text-sm text-neutral-300">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
