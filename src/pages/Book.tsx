import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBookingStore } from '@/hooks/use-booking-store';
import { supabase } from '@/integrations/supabase/client';
import { 
  SCOOTERS, 
  BUSINESS_HOURS, 
  BUSINESS_CONFIG,
  formatCurrency, 
  isSunday,
} from '@/lib/booking';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { CalendarIcon, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroText, ScrollReveal } from '@/components/animations/ScrollReveal';
import { PayPalButton } from '@/components/payment/PayPalButton';

const generateTimeSlots = (day: number) => {
  // day: 0 = Sunday, 1 = Monday, etc.
  if (day === 0) return []; // Sunday closed
  
  const hours = BUSINESS_HOURS[day === 0 ? 6 : day - 1];
  if (!hours.isOpen) return [];

  const [startHour] = hours.open.split(':').map(Number);
  const [endHour] = hours.close.split(':').map(Number);
  
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < endHour) {
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addBooking, getAvailableScooters } = useBookingStore();
  
  const initialType = searchParams.get('type') as 'single' | 'double' || 'single';
  
  const [step, setStep] = useState(1);
  const [scooterType, setScooterType] = useState<'single' | 'double'>(initialType);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>('');
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState<{ date: string; scooterType: string | null }[]>([]);

  // Fetch blocked dates from database
  useEffect(() => {
    const fetchBlockedDates = async () => {
      const { data } = await supabase
        .from('blocked_dates')
        .select('blocked_date, scooter_type');
      if (data) {
        setBlockedDates(data.map(d => ({ date: d.blocked_date, scooterType: d.scooter_type })));
      }
    };
    fetchBlockedDates();
  }, []);

  // Check if a date is blocked for the current scooter type
  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.some(b => 
      b.date === dateStr && (b.scooterType === 'all' || b.scooterType === scooterType)
    );
  };


  // Auto-calculate return date and time based on pickup + rental days
  const { returnDate, returnTime } = useMemo(() => {
    if (!pickupDate || !pickupTime) return { returnDate: undefined, returnTime: '' };
    
    // Return is exactly (rentalDays * 24h) after pickup
    const returnDt = addDays(pickupDate, rentalDays);
    
    // If return falls on Sunday, move to Monday
    const adjustedReturn = isSunday(returnDt) ? addDays(returnDt, 1) : returnDt;
    
    return { returnDate: adjustedReturn, returnTime: pickupTime };
  }, [pickupDate, pickupTime, rentalDays]);

  const selectedScooter = SCOOTERS.find(s => s.type === scooterType);

  const pickupTimeSlots = useMemo(() => {
    if (!pickupDate) return [];
    return generateTimeSlots(pickupDate.getDay());
  }, [pickupDate]);


  const pricing = useMemo(() => {
    if (!pickupDate || !pickupTime || !selectedScooter) {
      return null;
    }

    const days = rentalDays;
    const rentalFee = days * selectedScooter.pricePerDay;
    const depositAmount = rentalFee; // 100% upfront
    const remainingBalance = 0;

    return {
      days,
      rentalFee,
      depositAmount,
      remainingBalance,
      securityDeposit: BUSINESS_CONFIG.securityDeposit,
    };
  }, [pickupDate, pickupTime, rentalDays, selectedScooter]);

  const availability = useMemo(() => {
    if (!pickupDate || !returnDate) return null;
    return getAvailableScooters(scooterType, pickupDate, returnDate);
  }, [pickupDate, returnDate, scooterType, getAvailableScooters]);

  // Check if any date in the rental range is blocked
  const hasBlockedDateInRange = useMemo(() => {
    if (!pickupDate || !returnDate) return false;
    const days = eachDayOfInterval({ start: pickupDate, end: returnDate });
    return days.some(d => isDateBlocked(d));
  }, [pickupDate, returnDate, blockedDates, scooterType]);

  const handlePickupDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Check if Sunday
    if (isSunday(date)) {
      toast({
        title: "Sunday is Closed",
        description: "We're closed on Sundays. Please select another day.",
        variant: "destructive",
      });
      return;
    }

    // Check if blocked
    if (isDateBlocked(date)) {
      toast({
        title: "Date Unavailable",
        description: "This date is blocked. No scooters are available. Please choose another date.",
        variant: "destructive",
      });
      return;
    }
    
    setPickupDate(date);
    setPickupTime('');
  };

  const canProceedToStep2 = pickupDate && pickupTime && returnDate && returnTime && availability && availability > 0 && !hasBlockedDateInRange;
  const canProceedToStep3 = customerName && customerEmail && customerPhone;

  const handlePaymentSuccess = (orderId: string) => {
    if (!pickupDate || !returnDate || !pricing || !selectedScooter) return;

    const booking = addBooking({
      visitorId: `V-${Date.now()}`,
      scooterId: selectedScooter.id,
      scooterType,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      totalDays: pricing.days,
      rentalFee: pricing.rentalFee,
      depositAmount: pricing.depositAmount,
      securityDeposit: pricing.securityDeposit,
      remainingBalance: pricing.remainingBalance,
      status: 'confirmed',
      customerName,
      customerEmail,
      customerPhone,
    });

    toast({
      title: "Booking Confirmed!",
      description: `Your booking ID is ${booking.id}. Check your email for details.`,
    });
    
    navigate(`/booking-confirmation?id=${booking.id}&name=${encodeURIComponent(customerName)}&phone=${encodeURIComponent(customerPhone)}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <section className="py-12 bg-sand min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <HeroText delay={0.1}>
                <h1 className="font-display text-4xl font-bold mb-2">Book Your Scooter</h1>
              </HeroText>
              <HeroText delay={0.2}>
                <p className="text-muted-foreground">
                  Complete your booking in just a few simple steps
                </p>
              </HeroText>
            </div>

            {/* Progress Steps */}
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {[1, 2, 3].map((s) => (
                <motion.div 
                  key={s} 
                  className="flex items-center gap-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + s * 0.1 }}
                >
                  <motion.div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      step >= s 
                        ? "bg-gradient-ocean text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}
                    whileHover={{ scale: 1.1 }}
                    animate={step === s ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {s}
                  </motion.div>
                  {s < 3 && (
                    <motion.div 
                      className={cn(
                        "w-12 h-1 rounded",
                        step > s ? "bg-primary" : "bg-muted"
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4 + s * 0.1 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Dates */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="font-display">Select Scooter & Dates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Scooter Type */}
                      <div className="space-y-2">
                        <Label>Scooter Type</Label>
                        <Select value={scooterType} onValueChange={(v) => setScooterType(v as 'single' | 'double')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SCOOTERS.map((s) => (
                              <SelectItem key={s.id} value={s.type}>
                                {s.name} ({s.capacity} rider{s.capacity > 1 ? 's' : ''}) - {formatCurrency(s.pricePerDay)}/day
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pickup Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Pickup Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={pickupDate}
                                onSelect={handlePickupDateSelect}
                                disabled={(date) => date < new Date() || isSunday(date) || isDateBlocked(date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Pickup Time</Label>
                          <Select value={pickupTime} onValueChange={setPickupTime} disabled={!pickupDate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {pickupTimeSlots.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Number of Rental Days */}
                      <div className="space-y-2">
                        <Label>Number of Days</Label>
                        <Select value={rentalDays.toString()} onValueChange={(v) => setRentalDays(Number(v))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((d) => (
                              <SelectItem key={d} value={d.toString()}>{d} day{d > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Auto-calculated Return Info */}
                      {returnDate && returnTime && (
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p className="font-medium">Return: {format(returnDate, 'PPP')} at {returnTime}</p>
                          <p className="text-muted-foreground text-xs mt-1">Automatically calculated ({rentalDays} × 24 hours from pickup)</p>
                        </div>
                      )}

                      {/* Blocked Date Warning */}
                      {hasBlockedDateInRange && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                          <AlertCircle className="w-5 h-5" />
                          <span>One or more dates in your rental period are unavailable. Please choose different dates.</span>
                        </div>
                      )}

                      {/* Availability Notice */}
                      {availability !== null && !hasBlockedDateInRange && (
                        <div className={cn(
                          "flex items-center gap-2 p-3 rounded-lg",
                          availability > 0 ? "bg-palm/10 text-palm" : "bg-destructive/10 text-destructive"
                        )}>
                          {availability > 0 ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <span>{availability} scooter{availability > 1 ? 's' : ''} available for your dates</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5" />
                              <span>No scooters available for these dates. Please try different dates.</span>
                            </>
                          )}
                        </div>
                      )}

                      <Button 
                        variant="hero" 
                        className="w-full" 
                        size="lg"
                        disabled={!canProceedToStep2}
                        onClick={() => setStep(2)}
                      >
                        Continue to Details
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                )}

                {/* Step 2: Customer Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="font-display">Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Enter your full name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="your@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+676 XXXXXXX"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button 
                          variant="hero" 
                          className="flex-1"
                          disabled={!canProceedToStep3}
                          onClick={() => setStep(3)}
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && pricing && pickupDate && returnDate && selectedScooter && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="font-display">Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Pay Full Rental Fee with PayPal</p>
                        <p className="text-muted-foreground text-sm">
                          You will be charged <strong>${selectedScooter.priceUSD * pricing.days} USD</strong> ({formatCurrency(pricing.rentalFee)}) for your full rental.
                          A refundable security deposit of {formatCurrency(pricing.securityDeposit)} is collected in cash at pickup.
                        </p>
                      </div>

                      <div className="bg-coral/10 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-coral mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-coral">Important:</p>
                            <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                              <li>Full rental fee is charged at booking</li>
                              <li>Valid driver's license required at pickup</li>
                              <li>Security deposit of {formatCurrency(100)} collected in cash at pickup</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <PayPalButton
                        amount={selectedScooter.priceUSD * pricing.days}
                        currency="USD"
                        bookingData={{
                          scooterType: scooterType,
                          pickupDate: format(pickupDate, 'yyyy-MM-dd'),
                          pickupTime: pickupTime,
                          returnDate: format(returnDate, 'yyyy-MM-dd'),
                          returnTime: returnTime,
                          totalDays: pricing.days,
                          rentalFee: pricing.rentalFee,
                          depositAmount: pricing.depositAmount,
                          securityDeposit: pricing.securityDeposit,
                          remainingBalance: pricing.remainingBalance,
                          customerName: customerName,
                          customerEmail: customerEmail,
                          customerPhone: customerPhone,
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />

                      <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                        Back
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="shadow-card border-0 sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedScooter && (
                      <div className="pb-4 border-b border-border">
                        <h4 className="font-semibold">{selectedScooter.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedScooter.capacity} rider{selectedScooter.capacity > 1 ? 's' : ''} • {formatCurrency(selectedScooter.pricePerDay)}/day
                        </p>
                      </div>
                    )}

                    {pickupDate && (
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pickup</span>
                          <span>{format(pickupDate, 'MMM d, yyyy')} {pickupTime}</span>
                        </div>
                      </div>
                    )}

                    {returnDate && (
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Return</span>
                          <span>{format(returnDate, 'MMM d, yyyy')} {returnTime}</span>
                        </div>
                      </div>
                    )}

                    {pricing && (
                      <>
                        <div className="pt-4 border-t border-border space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{pricing.days} day{pricing.days > 1 ? 's' : ''} rental</span>
                            <span>{formatCurrency(pricing.rentalFee)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pay now (100%)</span>
                            <span className="font-medium text-primary">{formatCurrency(pricing.depositAmount)} (${selectedScooter.priceUSD * pricing.days} USD)</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total to Pay</span>
                            <span className="font-display text-xl font-bold text-primary">
                              ${selectedScooter.priceUSD * pricing.days} USD
                            </span>
                          </div>
                        </div>

                        <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
                          <p>+ {formatCurrency(pricing.securityDeposit)} refundable security deposit in cash at pickup (subject to inspection)</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
