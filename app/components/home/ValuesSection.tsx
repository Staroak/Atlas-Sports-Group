import React from "react";
import { VALUES } from "@/app/lib/constants";
import Container from "../layout/Container";

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-atlas-navy mb-4 font-heading">
            What We Stand For
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Our values guide everything we do, from how we coach to how we build community.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map((value, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-xl bg-neutral-50 hover:bg-atlas-sky/10 transition-all duration-300 hover:shadow-md"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-atlas-navy mb-3 font-heading group-hover:text-atlas-blue transition-colors">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
