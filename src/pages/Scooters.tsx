import { Layout } from "@/components/layout/Layout";
import { ScooterCard } from "@/components/scooters/ScooterCard";
import { SCOOTERS, formatCurrency, BUSINESS_CONFIG } from "@/lib/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, FileText, CreditCard, Info } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeroText,
  ScaleOnHover,
} from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const ScootersPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-12 pb-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <HeroText delay={0.1}>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Our Scooter Fleet
              </h1>
            </HeroText>
            <HeroText delay={0.2}>
              <p className="text-muted-foreground text-lg">
                Choose the perfect scooter for your Tongan adventure. All our
                scooters are well-maintained and ready to explore.
              </p>
            </HeroText>
          </div>
        </div>
      </section>

      {/* Scooters Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            staggerDelay={0.15}
          >
            {SCOOTERS.map((scooter) => (
              <StaggerItem key={scooter.id}>
                <ScaleOnHover scale={1.03}>
                  <ScooterCard scooter={scooter} />
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="font-display text-3xl font-bold mb-8 text-center">
                Pricing & Payment Details
              </h2>
            </ScrollReveal>

            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              staggerDelay={0.1}
            >
              <StaggerItem>
                <ScaleOnHover>
                  <Card className="shadow-card border-0 h-full">
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-lg">
                          Payment Structure
                        </h3>
                      </motion.div>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Booking Deposit
                          </span>
                          <span className="font-medium">
                            8% of rental (online, Visa)
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Remaining Balance
                          </span>
                          <span className="font-medium">Cash at pickup</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Security Deposit
                          </span>
                          <span className="font-medium">
                            {formatCurrency(BUSINESS_CONFIG.securityDeposit)} at
                            pickup
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>

              <StaggerItem>
                <ScaleOnHover>
                  <Card className="shadow-card border-0 h-full">
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center">
                          <Info className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-lg">
                          Rental Period
                        </h3>
                      </motion.div>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">1 Day</span>
                          <span className="font-medium">= 24 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Currency
                          </span>
                          <span className="font-medium">
                            Tongan Pa'anga (TOP)
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Minimum Rental
                          </span>
                          <span className="font-medium">1 day</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="font-display text-3xl font-bold mb-8 text-center">
                What's Included
              </h2>
            </ScrollReveal>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              staggerDelay={0.15}
            >
              <StaggerItem>
                <ScaleOnHover>
                  <Card className="shadow-card border-0">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Fuel className="w-7 h-7 text-primary-foreground" />
                      </motion.div>
                      <h3 className="font-display font-semibold mb-2">
                        Fuel Policy
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Fuel level is recorded at pickup. Return at same level.
                      </p>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>

              <StaggerItem>
                <ScaleOnHover>
                  <Card className="shadow-card border-0">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="w-7 h-7 text-primary-foreground" />
                      </motion.div>
                      <h3 className="font-display font-semibold mb-2">
                        Helmets
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Safety helmets provided for all riders.
                      </p>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ScootersPage;
