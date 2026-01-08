import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/app/lib/constants";
import Container from "../layout/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export default function ProgramsOverview() {
  return (
    <section id="programs" className="py-16 md:py-24 bg-neutral-50">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-atlas-navy mb-4 font-heading">
            Our Programs
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Find the perfect fit for your family. From youth leagues to adult recreation, we offer programs for every age and skill level.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PROGRAMS.map((program) => (
            <Link key={program.id} href={`/programs/${program.slug}`} className="block h-full group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                {/* Image */}
                {program.logo && (
                  <div className="relative h-48 w-full overflow-hidden bg-neutral rounded-t-xl">
                    <Image
                      src={program.logo}
                      alt={program.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-atlas-navy group-hover:text-atlas-blue transition-colors">
                    {program.name}
                  </CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {program.youthAges}
                    </Badge>
                    {program.adultAges && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        {program.adultAges}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Learn More →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="cta" size="lg">
            <Link href="/registration">View All Programs & Register</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
