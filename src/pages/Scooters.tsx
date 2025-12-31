import { Layout } from '@/components/layout/Layout';
import { ScooterCard } from '@/components/scooters/ScooterCard';
import { SCOOTERS, formatCurrency, BUSINESS_CONFIG } from '@/lib/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Fuel, FileText, CreditCard, Info } from 'lucide-react';

const ScootersPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-12 pb-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Scooter Fleet
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose the perfect scooter for your Tongan adventure. All our scooters are 
              well-maintained, fully insured, and ready to explore.
            </p>
          </div>
        </div>
      </section>

      {/* Scooters Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SCOOTERS.map((scooter) => (
              <ScooterCard key={scooter.id} scooter={scooter} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Pricing & Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">Payment Structure</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Booking Deposit</span>
                      <span className="font-medium">8% of rental (online, Visa)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Balance</span>
                      <span className="font-medium">Cash at pickup</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">{formatCurrency(BUSINESS_CONFIG.securityDeposit)} at pickup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center">
                      <Info className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">Rental Period</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">1 Day</span>
                      <span className="font-medium">= 24 hours</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="font-medium">Tongan Pa'anga (TOP)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Minimum Rental</span>
                      <span className="font-medium">1 day</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              What's Included
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center">
                    <Shield className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">Insurance</h3>
                  <p className="text-muted-foreground text-sm">
                    Comprehensive coverage included with every rental.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center">
                    <Fuel className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">Full Tank</h3>
                  <p className="text-muted-foreground text-sm">
                    Start with a full tank. Return at same level.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-ocean flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">Helmets</h3>
                  <p className="text-muted-foreground text-sm">
                    Safety helmets provided for all riders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ScootersPage;
