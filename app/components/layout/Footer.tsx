"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_NAME, NAV_LINKS, PROGRAM_LINKS, CONTACT_INFO } from "@/app/lib/constants";
import Container from "./Container";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

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
            <p className="text-xs text-neutral-300">
              {CONTACT_INFO.serviceArea}
            </p>
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

          {/* Programs Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-heading">Our Programs</h3>
            <ul className="space-y-2">
              {PROGRAM_LINKS.map((program) => (
                <li key={program.href}>
                  <Link
                    href={program.href}
                    className="text-sm text-neutral-200 hover:text-atlas-sky transition-colors"
                  >
                    {program.label}
                  </Link>
                </li>
              ))}
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
