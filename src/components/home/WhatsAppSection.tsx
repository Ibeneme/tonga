import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, Clock } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/booking";

export const WhatsAppSection = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in renting a scooter from Scooter Rental Tonga. Can you help me?"
    );
    window.open(
      `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-elevated border-0 overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left text-white">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Need Help? Chat With Us!
                </h2>
                <p className="text-white/90 mb-6">
                  Have questions about booking, availability, or anything else?
                  Send us a message on WhatsApp and we'll respond quickly!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                  <Button
                    onClick={handleWhatsAppClick}
                    size="lg"
                    className="bg-white text-green-600 hover:bg-white/90 font-semibold shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>

                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{BUSINESS_CONFIG.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-white/70 text-sm justify-center md:justify-start">
                  <Clock className="w-4 h-4" />
                  <span>
                    We typically respond within minutes during business hours
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
