import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Fuel,
  FileText,
} from "lucide-react";
import { BUSINESS_HOURS, formatCurrency, BUSINESS_CONFIG } from "@/lib/booking";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id") || "BK-XXXXXX";

  return (
    <Layout>
      <section className="py-12 bg-sand min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elevated border-0 overflow-hidden">
              <div className="bg-gradient-ocean p-8 text-center text-primary-foreground">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">
                  Booking Confirmed!
                </h1>
                <p className="opacity-90">Your adventure in Tonga awaits</p>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="text-center pb-6 border-b border-border">
                  <p className="text-muted-foreground mb-2">
                    Booking Reference
                  </p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {bookingId}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Pickup Location
                  </h3>
                  <p className="text-muted-foreground">
                    Scooter Rental Tonga
                    <br />
                    Nuku'alofa, Tonga
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Business Hours
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {BUSINESS_HOURS.map((hours) => (
                      <div
                        key={hours.day}
                        className="flex justify-between text-muted-foreground"
                      >
                        <span>{hours.day}</span>
                        <span>
                          {hours.isOpen
                            ? `${hours.open} - ${hours.close}`
                            : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-coral/10 p-4 rounded-lg space-y-3">
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-coral" />
                    What to Bring
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Valid driver's license</li>
                    <li>• This booking confirmation</li>
                    <li>• Remaining balance: Pay in cash at pickup</li>
                    <li>
                      • Security deposit:{" "}
                      {formatCurrency(BUSINESS_CONFIG.securityDeposit)}{" "}
                      (refundable)
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-primary" />
                    Fuel Policy
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your scooter will be provided with a full tank of fuel.
                    Please return it with the same fuel level to avoid
                    additional charges.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-display font-semibold text-lg">
                    Contact Us
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="tel:+676XXXXXXX"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>+676 XXX XXXX</span>
                    </a>
                    <a
                      href="mailto:info@scooterrentaltonga.to"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>info@scooterrentaltonga.to</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/">Back to Home</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.print()}
                  >
                    Print Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingConfirmation;
