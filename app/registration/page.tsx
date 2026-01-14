import { Suspense } from "react";
import { getPublishedPrograms } from "@/app/lib/queries/programs";
import { REGISTRATION_STATUS } from "@/app/lib/constants";
import { RegistrationContent } from "./RegistrationContent";

export default async function RegistrationPage() {
  const programs = await getPublishedPrograms();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegistrationContent programs={programs} registrationStatus={REGISTRATION_STATUS} />
    </Suspense>
  );
}
