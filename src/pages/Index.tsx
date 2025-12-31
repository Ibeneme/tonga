import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScooterCard } from '@/components/scooters/ScooterCard';
import { SCOOTERS, BUSINESS_HOURS, formatCurrency, BUSINESS_CONFIG } from '@/lib/booking';
import { HeroCarousel } from '@/components/HeroCarousel';
import { FAQSection } from '@/components/home/FAQSection';
import { WhatsAppSection } from '@/components/home/WhatsAppSection';
import { 
  Shield, 
  CreditCard, 
  Clock, 
  MapPin, 
  Fuel, 
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'All rentals include comprehensive insurance coverage for your peace of mind.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payment',
    description: 'Pay a small deposit online with Visa. Balance due at pickup.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Convenient pickup times Monday through Saturday.',
  },
  {
    icon: Fuel,
    title: 'Fuel Included',
    description: 'Start your adventure with a full tank. Return at the same level.',
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-foreground/30" />
        
        <div className="container mx-auto relative z-10 px-4 py-20">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm mb-6">
              <MapPin className="w-4 h-4" />
              <span>Explore Beautiful Tonga</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Discover Paradise on Two Wheels
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Rent a scooter and explore the stunning islands of Tonga at your own pace. 
              Safe, affordable, and unforgettable adventures await.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Book Your Scooter
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="sand" size="xl" asChild>
                <Link to="/scooters">View Our Fleet</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-coral" />
                <span>From {formatCurrency(50, 'TOP')}/day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-coral" />
                <span>Helmets Included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-coral" />
                <span>Easy Online Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make exploring Tonga simple, safe, and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow duration-300 border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scooters Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Scooters
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect ride for your Tongan adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SCOOTERS.map((scooter) => (
              <ScooterCard key={scooter.id} scooter={scooter} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-20 bg-gradient-ocean text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
              Simple, Transparent Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-display font-bold mb-2">50 TOP</div>
                <p className="text-primary-foreground/80">Solo Scooter / Day</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-display font-bold mb-2">70 TOP</div>
                <p className="text-primary-foreground/80">2-Rider Scooter / Day</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-display font-bold mb-2">8%</div>
                <p className="text-primary-foreground/80">Online Deposit Only</p>
              </div>
            </div>

            <p className="mt-8 text-primary-foreground/80">
              100 TOP refundable security deposit collected at pickup. Pay balance in cash at store.
            </p>

            <Button variant="sand" size="xl" className="mt-8" asChild>
              <Link to="/book">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* WhatsApp Section */}
      <WhatsAppSection />

      {/* Testimonials */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Sarah M.', country: 'Australia', text: 'Amazing experience! The scooter was in perfect condition and exploring Tonga this way was unforgettable.' },
              { name: 'John D.', country: 'New Zealand', text: 'Super easy booking process. The team was friendly and gave great tips on where to go.' },
              { name: 'Emma L.', country: 'UK', text: 'Best way to see the islands! Affordable, safe, and so much fun. Highly recommend!' },
            ].map((review, index) => (
              <Card key={index} className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-sunset text-sunset" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{review.text}"</p>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.country}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-elevated border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready for Your Adventure?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Book your scooter today and start exploring the beautiful islands of Tonga.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Book Your Scooter Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
