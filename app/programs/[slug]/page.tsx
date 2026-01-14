import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProgramBySlug, getPublishedProgramSlugs } from "@/app/lib/queries/programs";
import Container from "@/app/components/layout/Container";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: `${program.name} | Atlas Sports Group`,
    description: program.description,
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-atlas-navy via-blue-600 to-atlas-sky py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {program.youthAges}
                {program.adultAges && ` | ${program.adultAges}`}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
                {program.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
                {program.tagline}
              </p>
              <p className="text-lg text-white/80 mb-8">
                {program.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="cta" size="xl">
                  <Link href={`/registration#${program.slug}`}>Register Now</Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="bg-white text-black border-white hover:bg-white/90">
                  <Link href="/programs">View All Programs</Link>
                </Button>
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white rounded-2xl shadow-2xl p-8">
                <Image
                  src={program.logo}
                  alt={program.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy font-heading mb-8 text-center">
            What You&apos;ll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {program.whatYoullLearn.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy font-heading mb-8 text-center">
            Program Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {program.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features & Schedule Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-atlas-navy font-heading mb-6">
                Program Features
              </h3>
              <ul className="space-y-3">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-atlas-sky"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Bring */}
            <div>
              <h3 className="text-2xl font-bold text-atlas-navy font-heading mb-6">
                What to Bring
              </h3>
              <ul className="space-y-3">
                {program.whatToBring.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-none">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-atlas-navy font-heading mb-3">
                  Schedule
                </h3>
                <p className="text-gray-700">{program.schedule}</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white via-blue-500 to-atlas-navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join {program.name} and start building healthy habits through sport!
            </p>
            <Button asChild variant="outline" size="xl" className="bg-white text-blue-600 hover:bg-white/90 border-white">
              <Link href={`/registration#${program.slug}`}>Register Now</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
