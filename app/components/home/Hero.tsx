"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import Container from "../layout/Container";
import { SITE_NAME, SITE_TAGLINE } from "@/app/lib/constants";

export default function Hero() {
  return (
    <section className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-[#B8D8FF] via-[#CCF2FF] to-[#78FFD0] overflow-hidden py-12 md:py-16">
      {/* Cloud Background - Top */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
        {/* Cloud 1 - Large left */}
        <div className="absolute top-4 left-[5%] animate-cloud-slow">
          <svg viewBox="0 0 200 100" className="w-40 h-20 fill-white/70">
            <ellipse cx="60" cy="60" rx="50" ry="30" />
            <ellipse cx="100" cy="50" rx="60" ry="35" />
            <ellipse cx="150" cy="60" rx="45" ry="28" />
            <ellipse cx="80" cy="45" rx="40" ry="25" />
            <ellipse cx="130" cy="45" rx="35" ry="22" />
          </svg>
        </div>

        {/* Cloud 2 - Medium right */}
        <div className="absolute top-8 right-[10%] animate-cloud-medium">
          <svg viewBox="0 0 180 90" className="w-36 h-18 fill-white/60">
            <ellipse cx="50" cy="55" rx="40" ry="25" />
            <ellipse cx="90" cy="45" rx="50" ry="30" />
            <ellipse cx="140" cy="55" rx="35" ry="22" />
            <ellipse cx="70" cy="40" rx="30" ry="20" />
            <ellipse cx="110" cy="40" rx="35" ry="22" />
          </svg>
        </div>

        {/* Cloud 3 - Small center-left */}
        <div className="absolute top-20 left-[25%] animate-cloud-fast hidden md:block">
          <svg viewBox="0 0 140 70" className="w-24 h-12 fill-white/50">
            <ellipse cx="40" cy="45" rx="30" ry="18" />
            <ellipse cx="70" cy="38" rx="40" ry="22" />
            <ellipse cx="105" cy="45" rx="28" ry="16" />
            <ellipse cx="55" cy="32" rx="25" ry="15" />
          </svg>
        </div>

        {/* Cloud 4 - Medium center-right */}
        <div className="absolute top-12 right-[30%] animate-cloud-slow hidden lg:block">
          <svg viewBox="0 0 160 80" className="w-32 h-16 fill-white/55">
            <ellipse cx="45" cy="50" rx="35" ry="22" />
            <ellipse cx="80" cy="42" rx="45" ry="28" />
            <ellipse cx="120" cy="50" rx="32" ry="20" />
            <ellipse cx="60" cy="36" rx="28" ry="18" />
            <ellipse cx="100" cy="36" rx="30" ry="18" />
          </svg>
        </div>
      </div>

      {/* Soft Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute top-1/4 left-10 w-16 h-16 bg-white/20 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-green-300/30 rounded-full blur-2xl animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300/25 rounded-full blur-xl animate-float-fast hidden md:block"></div>

      {/* Content */}
      <Container className="relative z-10 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Large Logo */}
          <div className="flex justify-center animate-fadeIn">
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/40 hover:ring-white/60 transition-all duration-300 hover:scale-105">
              <Image
                src="/logos/Atlas Logo.jpg"
                alt={SITE_NAME}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Site Name */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-atlas-navy font-heading leading-tight drop-shadow-lg animate-slideUp">
              {SITE_NAME}
            </h1>
            <p className="text-base md:text-lg text-atlas-navy/80 font-medium animate-slideUp">
              {SITE_TAGLINE}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2 animate-fadeIn">
            <Button asChild variant="cta" size="lg" className="shadow-2xl hover:shadow-green-500/25">
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>
        </div>
      </Container>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes cloud-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }

        @keyframes cloud-medium {
          0% { transform: translateX(0); }
          100% { transform: translateX(-15px); }
        }

        @keyframes cloud-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(10px); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-cloud-slow {
          animation: cloud-slow 8s ease-in-out infinite alternate;
        }

        .animate-cloud-medium {
          animation: cloud-medium 6s ease-in-out infinite alternate;
        }

        .animate-cloud-fast {
          animation: cloud-fast 4s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
}
