"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/app/lib/constants";
import Container from "../components/layout/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";

// Program schedule data
const PROGRAM_SEASONS = [
  { name: "Spring Season", months: "April - June", color: "bg-green-500" },
  { name: "Summer Season", months: "July - August", color: "bg-yellow-500" },
  { name: "Fall Season", months: "September - December", color: "bg-orange-500" },
];

export default function ProgramsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  return (
    <div>
      {/* Page Header with more color */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#B8D8FF] via-[#CCF2FF] to-[#78FFD0] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>

        <Container>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-atlas-navy mb-4 font-heading">
              Our Programs
            </h1>
            <p className="text-lg md:text-xl text-neutral-700">
              Find the perfect fit for your family. From youth leagues to adult recreation, we offer programs for every age and skill level.
            </p>
          </div>
        </Container>
      </section>

      {/* Programs Grid with colorful accents */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, #2563eb 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Programs - takes 3 columns on large screens */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROGRAMS.map((program) => {
                return (
                  <Card key={program.id} className="h-full flex flex-col transition-all duration-300 hover:shadow-xl overflow-hidden">
                    {/* Larger Image with colored overlay on hover */}
                    {program.logo && (
                      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
                        <Image
                          src={program.logo}
                          alt={program.name}
                          fill
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl text-atlas-navy">
                        {program.name}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                          {program.youthAges}
                        </Badge>
                        {program.adultAges && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            {program.adultAges}
                          </Badge>
                        )}
                      </div>
                      {/* Schedule info */}
                      <p className="text-xs text-neutral-500 mt-2">
                        {program.schedule}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <a
                        href={`/programs/${program.slug}`}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg w-full sm:w-auto cursor-pointer"
                      >
                        Learn More
                      </a>
                      <a
                        href={`/registration#${program.slug}`}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-xl w-full sm:w-auto cursor-pointer"
                      >
                        Register
                      </a>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r text-white">
                    <CardTitle className="text-black text-xl">Program Schedule</CardTitle>
                    <CardDescription className="text-atlas-navy">
                      View upcoming seasons and dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    {mounted && (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border w-full"
                      />
                    )}

                    {/* Season Legend */}
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-atlas-navy text-sm">Upcoming Seasons</h4>
                      {PROGRAM_SEASONS.map((season) => (
                        <div key={season.name} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${season.color}`}></div>
                          <div>
                            <p className="text-sm font-medium text-neutral-800">{season.name}</p>
                            <p className="text-xs text-neutral-500">{season.months}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-atlas-navy mb-1">Registration Opens</p>
                      <p className="text-xs text-neutral-600">Late January 2026</p>
                      <p className="text-xs text-neutral-500 mt-2">Check back soon for exact dates!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA Section with color */}
      <section className="py-16 bg-gradient-to-b from-white via-blue-400 to-atlas-navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy mb-4 font-heading">Ready to Join?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Registration opens late January 2026. Sign up for updates to be the first to know!
            </p>
            <Button asChild variant="outline" size="xl" className="bg-white text-blue-600 hover:bg-white/90 border-white">
              <Link href="/registration">Get Notified</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
