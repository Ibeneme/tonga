import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScooterCard } from "@/components/scooters/ScooterCard";
import { SCOOTERS, formatCurrency } from "@/lib/booking";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FAQSection } from "@/components/home/FAQSection";
import { WhatsAppSection } from "@/components/home/WhatsAppSection";
import { FloatingWhatsApp } from "@/components/animations/FloatingWhatsApp";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeroText,
  ScaleOnHover,
} from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, ArrowRight, Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    country: "Australia",
    text: "Amazing experience! The scooter was in perfect condition and exploring Tonga this way was unforgettable.",
  },
  {
    name: "John D.",
    country: "New Zealand",
    text: "Super easy booking process. The team was friendly and gave great tips on where to go.",
  },
  {
    name: "Emma L.",
    country: "UK",
    text: "Best way to see the islands! Affordable, safe, and so much fun. Highly recommend!",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-foreground/30" />

        <div className="container mx-auto relative z-10 px-4 py-20">
          <div className="max-w-2xl">
            <HeroText delay={0.2}>
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm mb-6"
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255,255,255,0.4)",
                    "0 0 0 8px rgba(255,255,255,0)",
                    "0 0 0 0 rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, repeatDelay: 1 },
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <MapPin className="w-4 h-4" />
                </motion.div>
                <span>Explore Beautiful Tonga</span>
              </motion.div>
            </HeroText>

            <HeroText delay={0.4}>
              <motion.h1
                className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Discover{" "}
                </motion.span>
                <motion.span
                  className="text-coral"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Paradise{" "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  on Two Wheels
                </motion.span>
              </motion.h1>
            </HeroText>

            <HeroText delay={0.6}>
              <motion.p
                className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
              >
                Rent a scooter and explore the stunning islands of Tonga at your
                own pace. Safe, affordable, and unforgettable adventures await.
              </motion.p>
            </HeroText>

            <HeroText delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/book">
                      Book Your Scooter
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <Button variant="sand" size="xl" asChild>
                    <Link to="/scooters">View Our Fleet</Link>
                  </Button>
                </motion.div>
              </div>
            </HeroText>

            <HeroText delay={1}>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-10 text-primary-foreground/80 text-sm md:text-base">
                {[
                  { text: `From ${formatCurrency(50, "TOP")}/day`, delay: 1.7 },
                  { text: "Helmets Included", delay: 1.9 },
                  { text: "Easy Online Booking", delay: 2.1 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: item.delay, duration: 0.5 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: item.delay + 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-coral" />
                    </motion.div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </HeroText>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-2"
            whileHover={{ scale: 1.2, borderColor: "rgba(255,255,255,0.8)" }}
          >
            <motion.div
              className="w-1.5 h-3 bg-primary-foreground/70 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Scooters Section */}
      <section className="py-16 md:py-24 bg-sand overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-ocean flex items-center justify-center shadow-elevated"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🛵
                </motion.div>
              </motion.div>
              <motion.h2
                className="font-display text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Our Scooters
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose the perfect ride for your Tongan adventure.
              </motion.p>
            </div>
          </ScrollReveal>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
            staggerDelay={0.25}
          >
            {SCOOTERS.map((scooter, index) => (
              <StaggerItem key={scooter.id}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotate: index % 2 === 0 ? -3 : 3,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <ScooterCard scooter={scooter} />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 md:py-24 bg-gradient-ocean text-primary-foreground overflow-hidden relative">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-5xl mb-6"
              >
                💰
              </motion.div>
              <motion.h2
                className="font-display text-3xl md:text-4xl font-bold mb-8"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                Simple, Transparent Pricing
              </motion.h2>

              <StaggerContainer
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
                staggerDelay={0.2}
              >
                {[
                  { value: "50 TOP", label: "Solo Scooter / Day", icon: "🛵" },
                  {
                    value: "70 TOP",
                    label: "2-Rider Scooter / Day",
                    icon: "👫",
                  },
                  { value: "8%", label: "Online Deposit Only", icon: "✨" },
                ].map((item, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 relative overflow-hidden group"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 40, rotateX: 20 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/0 to-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div
                        className="text-2xl mb-2"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <motion.div
                        className="text-3xl md:text-4xl font-display font-bold mb-2 relative z-10"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          type: "spring",
                        }}
                      >
                        {item.value}
                      </motion.div>
                      <p className="text-primary-foreground/80 text-sm md:text-base relative z-10">
                        {item.label}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <ScrollReveal delay={0.4}>
                <motion.p
                  className="mt-8 text-primary-foreground/80"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  100 TOP refundable security deposit collected at pickup. Pay
                  balance in cash at store.
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <Button variant="sand" size="xl" asChild>
                    <Link to="/book">Book Now</Link>
                  </Button>
                </motion.div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* WhatsApp Section */}
      <WhatsAppSection />

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-sand overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, y: 20 }}
                whileInView={{ scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-4xl mb-4"
              >
                ⭐
              </motion.div>
              <motion.h2
                className="font-display text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                What Our Customers Say
              </motion.h2>
            </div>
          </ScrollReveal>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            staggerDelay={0.25}
          >
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 60, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card className="shadow-card border-0 h-full overflow-hidden relative group">
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{
                              opacity: 0,
                              scale: 0,
                              rotate: -180,
                              y: -10,
                            }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                              rotate: 0,
                              y: 0,
                            }}
                            transition={{
                              delay: 0.08 * i + index * 0.1,
                              duration: 0.4,
                              type: "spring",
                            }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.3, rotate: 15 }}
                          >
                            <Star className="w-5 h-5 fill-sunset text-sunset" />
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        className="text-muted-foreground mb-4 italic"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        "{review.text}"
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="font-semibold">{review.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.country}
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="max-w-4xl mx-auto shadow-elevated border-0 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-coral/5"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                <CardContent className="p-8 md:p-12 text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="text-5xl mb-6"
                  >
                    🌴
                  </motion.div>
                  <motion.h2
                    className="font-display text-3xl md:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Ready for Your Adventure?
                  </motion.h2>
                  <motion.p
                    className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Book your scooter today and start exploring the beautiful
                    islands of Tonga.
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <Button variant="hero" size="xl" asChild>
                      <Link to="/book">
                        Book Your Scooter Now
                        <motion.span
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
