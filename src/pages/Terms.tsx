import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS_CONFIG, BUSINESS_HOURS, formatCurrency } from "@/lib/booking";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeroText,
} from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <Layout>
      <section className="py-12 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <HeroText delay={0.1}>
                <h1 className="font-display text-4xl font-bold mb-4">
                  Terms & Conditions
                </h1>
              </HeroText>
              <HeroText delay={0.2}>
                <p className="text-muted-foreground">
                  Please read these terms carefully before booking a scooter.
                </p>
              </HeroText>
            </div>

            <StaggerContainer className="space-y-6" staggerDelay={0.08}>
              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      1. Rental Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                      By booking a scooter with {BUSINESS_CONFIG.name}, you
                      agree to the following terms and conditions. This
                      agreement is binding once your booking deposit has been
                      processed.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      2. Eligibility Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>To rent a scooter, you must:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Be at least 18 years of age</li>
                      <li>
                        Hold a valid driver's license (A valid overseas driving
                        licence is sufficient. A Tongan driving licence must
                        include category A)
                      </li>
                      <li>Present your license at the time of pickup</li>
                      <li>
                        Be capable of safely operating a motorized scooter
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      3. Booking & Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Booking Deposit:</strong> An 8% non-refundable
                        deposit is required at the time of booking. This deposit
                        secures your scooter for the selected dates.
                      </li>
                      <li>
                        <strong>Remaining Balance:</strong> The balance of your
                        rental fee is due in cash at pickup.
                      </li>
                      <li>
                        <strong>Security Deposit:</strong> A refundable security
                        deposit of{" "}
                        {formatCurrency(BUSINESS_CONFIG.securityDeposit)} is
                        collected at pickup. This is returned upon satisfactory
                        inspection of the scooter at return.
                      </li>
                      <li>
                        <strong>Payment Methods:</strong> Online booking
                        deposits are accepted via Visa card only. In-store
                        payments can be made in cash.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      4. Rental Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        One rental day equals 24 hours from the pickup time.
                      </li>
                      <li>
                        Late returns will be charged for an additional day.
                      </li>
                      <li>
                        We are closed on Sundays. Rentals cannot start or end on
                        Sunday.
                      </li>
                      <li>
                        If you pick up on Saturday, your rental must extend at
                        least until Monday.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      5. Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <div className="grid grid-cols-2 gap-2">
                      {BUSINESS_HOURS.map((hours, index) => (
                        <motion.div
                          key={hours.day}
                          className="flex justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.05 * index }}
                        >
                          <span>{hours.day}</span>
                          <span>
                            {hours.isOpen
                              ? `${hours.open} - ${hours.close}`
                              : "Closed"}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      6. Fuel Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      The fuel level is recorded at pickup, and scooters must be
                      returned with the same fuel level. A full tank costs
                      approximately 10 Paanga. Only unleaded petrol should be
                      used. If the fuel level is lower than at pickup, you will
                      be charged for the difference.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      7. Rider Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Always wear the provided helmet while operating the
                        scooter.
                      </li>
                      <li>Obey all local traffic laws and regulations.</li>
                      <li>
                        Do not operate the scooter under the influence of
                        alcohol or drugs.
                      </li>
                      <li>Report any accidents or damage immediately.</li>
                      <li>
                        Only authorized riders listed on the rental agreement
                        may operate the scooter.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      8. Damage & Liability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        You are responsible for any damage to the scooter during
                        the rental period.
                      </li>
                      <li>
                        The security deposit may be used to cover minor damages.
                      </li>
                      <li>
                        Major damages may result in additional charges beyond
                        the security deposit.
                      </li>
                      <li>
                        Theft or total loss of the scooter is the renter's
                        responsibility.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      9. Cancellation Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        The booking deposit is non-refundable under any
                        circumstances.
                      </li>
                      <li>
                        Cancellations must be made at least 24 hours before the
                        pickup time.
                      </li>
                      <li>No-shows will forfeit the full booking deposit.</li>
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="shadow-card border-0 bg-coral/5 border border-coral/20">
                    <CardHeader>
                      <CardTitle className="font-display text-coral">
                        Important Notices
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                      <p>• Booking deposit is non-refundable</p>
                      <p>• Security deposit applies to damages</p>
                      <p>• Valid driver's license required at pickup</p>
                      <p>• Fuel must be returned at same level</p>
                      <p>• We are closed on Sundays</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
