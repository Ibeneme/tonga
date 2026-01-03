import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BUSINESS_HOURS, BUSINESS_CONFIG } from "@/lib/booking";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeroText,
  ScaleOnHover,
} from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="py-12 bg-sand min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <HeroText delay={0.1}>
                <h1 className="font-display text-4xl font-bold mb-4">
                  Contact Us
                </h1>
              </HeroText>
              <HeroText delay={0.2}>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Have questions about our scooters or your booking? We're here
                  to help!
                </p>
              </HeroText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <ScrollReveal direction="left" delay={0.1}>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="font-display">
                      Send Us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Label htmlFor="name">Name *</Label>
                          <Input id="name" placeholder="Your name" required />
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+676 XXXXXXX"
                        />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="What's this about?"
                          required
                        />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={5}
                          required
                        />
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="hero"
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Contact Info */}
              <StaggerContainer className="space-y-6" staggerDelay={0.1}>
                <StaggerItem>
                  <ScaleOnHover>
                    <Card className="shadow-card border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <MapPin className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                          <div>
                            <h3 className="font-display font-semibold mb-1">
                              Location
                            </h3>
                            <p className="text-muted-foreground">
                              {BUSINESS_CONFIG.address}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>

                <StaggerItem>
                  <ScaleOnHover>
                    <Card className="shadow-card border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <Phone className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                          <div>
                            <h3 className="font-display font-semibold mb-1">
                              Phone
                            </h3>
                            <a
                              href={`tel:${BUSINESS_CONFIG.phone}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {BUSINESS_CONFIG.phone}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>

                <StaggerItem>
                  <ScaleOnHover>
                    <Card className="shadow-card border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <Mail className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                          <div>
                            <h3 className="font-display font-semibold mb-1">
                              Email
                            </h3>
                            <a
                              href={`mailto:${BUSINESS_CONFIG.email}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {BUSINESS_CONFIG.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>

                <StaggerItem>
                  <ScaleOnHover>
                    <Card className="shadow-card border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <Clock className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold mb-3">
                              Business Hours
                            </h3>
                            <div className="space-y-1">
                              {BUSINESS_HOURS.map((hours, index) => (
                                <motion.div
                                  key={hours.day}
                                  className="flex justify-between text-sm"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                >
                                  <span className="text-muted-foreground">
                                    {hours.day}
                                  </span>
                                  <span
                                    className={
                                      hours.isOpen
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    {hours.isOpen
                                      ? `${hours.open} - ${hours.close}`
                                      : "Closed"}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
