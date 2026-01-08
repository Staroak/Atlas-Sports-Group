import React from "react";
import { Metadata } from "next";
import ValuesSection from "../components/home/ValuesSection";
import Container from "../components/layout/Container";

export const metadata: Metadata = {
  title: "About Us | Atlas Sports Group",
  description: "Learn about Atlas Sports Group's mission, values, and commitment to building healthy habits through sport in the Tri-Cities.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#a8dadc] to-[#77b5ba]">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-heading">
              About Atlas Sports Group
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Building healthy habits through sport in the Tri-Cities community.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-white">
        <Container size="narrow">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy mb-6 font-heading">
              Our Mission
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-6">
              Make sport easy to access and enjoyable—creating healthy habits and community through fun, safe, recreational programs.
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy mb-6 font-heading mt-12">
              Our Vision
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Become the Tri-Cities' most trusted multi-sport recreation provider, offering a clear pathway from "first time trying a sport" to ongoing seasonal participation for both youth and adults.
            </p>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <ValuesSection />

      {/* Community Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy mb-6 font-heading">
              Serving the Tri-Cities
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Atlas Sports Group proudly serves Port Moody, Coquitlam, and Port Coquitlam with high-quality, recreational sport programming for youth and adults. We focus on healthy living, fun, inclusion, and community connection through accessible sport options and reliable operations.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
