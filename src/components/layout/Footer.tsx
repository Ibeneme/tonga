import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { BUSINESS_HOURS, BUSINESS_CONFIG } from "@/lib/booking";
import logoImg from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={logoImg}
                  alt="Scooter Rental Tonga"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-sm sm:text-base">
                SCOOTER RENTAL TONGA
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Explore the beautiful islands of Tonga on two wheels. Safe,
              affordable, and unforgettable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/scooters"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Our Scooters
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Business Hours
            </h4>
            <ul className="space-y-1 text-sm">
              {BUSINESS_HOURS.map((hours) => (
                <li
                  key={hours.day}
                  className="flex justify-between text-primary-foreground/70"
                >
                  <span>{hours.day.slice(0, 3)}</span>
                  <span>
                    {hours.isOpen ? `${hours.open} - ${hours.close}` : "Closed"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://maps.app.goo.gl/HWdNzHCqBuemuS998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{BUSINESS_CONFIG.address}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`tel:${BUSINESS_CONFIG.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {BUSINESS_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`mailto:${BUSINESS_CONFIG.email}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} Scooter Rental Tonga. All rights
            reserved.
          </p>
          <p className="mt-1">Payment accepted: Visa Card only</p>
        </div>
      </div>
    </footer>
  );
};
