"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/app/components/layout/Container";
import { Button } from "@/app/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface Program {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  youthAges: string;
  adultAges?: string;
  features: string[];
  schedule: string;
  registrationOpen?: boolean;
  registrationMessage?: string;
}

interface RegistrationContentProps {
  programs: Program[];
}

export function RegistrationContent({ programs }: RegistrationContentProps) {
  const searchParams = useSearchParams();

  // Handle auto-scroll when URL has hash or program query param
  useEffect(() => {
    const program = searchParams.get("program");
    const hash = window.location.hash.slice(1);
    const targetId = program || hash;

    if (targetId) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [searchParams]);

  // Check if any program has registration open
  const anyRegistrationOpen = programs.some(p => p.registrationOpen);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-atlas-navy via-blue-600 to-atlas-sky py-16">
        <Container>
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
              Program Registration
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Choose your program below and register for the upcoming season
            </p>
            {!anyRegistrationOpen && (
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-white font-medium">
                  Registration is currently closed. Check back soon!
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-gray-50 border-b sticky top-0 z-40">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {programs.map((program) => (
              <Button
                key={program.id}
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-atlas-navy hover:text-white transition-colors"
              >
                <a href={`#${program.slug}`}>{program.name}</a>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Program Registration Sections */}
      <section className="py-12">
        <Container>
          <div className="space-y-16">
            {programs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-neutral-600">
                  No programs available for registration at this time. Check back soon!
                </p>
              </div>
            ) : (
              programs.map((program, index) => (
                <div
                  key={program.id}
                  id={program.slug}
                  className="scroll-mt-32"
                >
                  <Card className="overflow-hidden shadow-lg">
                    <div className={`grid grid-cols-1 lg:grid-cols-3 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                      {/* Program Info - 2 columns */}
                      <div className="lg:col-span-2 p-8">
                        <div className="flex items-start gap-6 mb-6">
                          {/* Logo */}
                          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                            {program.logo && (
                              <Image
                                src={program.logo}
                                alt={program.name}
                                fill
                                className="object-contain p-2"
                              />
                            )}
                          </div>
                          {/* Title & Description */}
                          <div>
                            <CardTitle className="text-2xl md:text-3xl text-atlas-navy mb-2">
                              {program.name}
                            </CardTitle>
                            <CardDescription className="text-base mb-3">
                              {program.tagline}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {program.youthAges && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  {program.youthAges}
                                </Badge>
                              )}
                              {program.adultAges && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  {program.adultAges}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                          {program.description}
                        </p>

                        {/* Features */}
                        {program.features && program.features.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            {program.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Schedule */}
                        {program.schedule && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <p className="text-sm font-medium text-atlas-navy mb-1">Schedule</p>
                            <p className="text-sm text-gray-600">{program.schedule}</p>
                          </div>
                        )}

                        {/* Learn More Link */}
                        <Link
                          href={`/programs/${program.slug}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                        >
                          Learn more about this program
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>

                      {/* Registration Panel - 1 column */}
                      <div className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l">
                        <h3 className="text-xl font-bold text-atlas-navy mb-4">
                          Register for {program.name.split(' ')[0]}
                        </h3>

                        {program.registrationOpen ? (
                          <>
                            <p className="text-gray-600 mb-6 text-sm">
                              Spots are limited! Secure your place today.
                            </p>
                            <Button variant="cta" size="xl" className="w-full mb-4">
                              Register Now
                            </Button>
                            <p className="text-xs text-gray-500">
                              Early bird pricing available until Feb 15
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6 text-sm">
                              {program.registrationMessage || 'Registration coming soon'}
                            </p>
                            <Button variant="atlas" size="lg" className="w-full mb-4">
                              Get Notified
                            </Button>
                            <p className="text-xs text-gray-500">
                              Be the first to know when registration opens
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-b from-white via-blue-500 to-atlas-navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Have Questions?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Not sure which program is right for you? Contact us and we&apos;ll help you find the perfect fit!
            </p>
            <Button asChild variant="outline" size="xl" className="bg-white text-blue-600 hover:bg-white/90 border-white">
              <Link href="/about">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
