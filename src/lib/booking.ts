// Scooter types and inventory
export interface Scooter {
    id: string;
    type: 'single' | 'double';
    name: string;
    capacity: number;
    pricePerDay: number;
    priceCurrency: 'TOP' | 'NZD';
    priceNZD: number;
    description: string;
    features: string[];
    available: number;
    total: number;
    image?: string;
  }
  
  export interface Booking {
    id: string;
  visitorId: string;
    scooterId: string;
    scooterType: 'single' | 'double';
    pickupDate: Date;
    pickupTime: string;
    returnDate: Date;
    returnTime: string;
    totalDays: number;
    rentalFee: number;
    depositAmount: number; // 8% of rental fee
    securityDeposit: number; // 100 TOP
    remainingBalance: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    createdAt: Date;
  }
  
  export interface BusinessHours {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }
  
  // Business configuration
  export const BUSINESS_CONFIG = {
    name: 'SCOOTER RENTAL TONGA',
    location: 'Tonga',
    address: "Federal Pacific House, Taufa'ahau Road, Nuku'alofa, Kingdom of Tonga",
    phone: '+676 8626339',
    whatsapp: '006768626339',
    email: 'info@scooterrentaltonga.to',
    currency: 'TOP' as const,
    fallbackCurrency: 'NZD' as const,
    securityDeposit: 100,
    bookingDepositPercent: 0.08,
    paymentMethods: ['Visa'] as const,
  };
  
  export const BUSINESS_HOURS: BusinessHours[] = [
    { day: 'Monday', open: '09:00', close: '16:00', isOpen: true },
    { day: 'Tuesday', open: '09:00', close: '16:00', isOpen: true },
    { day: 'Wednesday', open: '09:00', close: '16:00', isOpen: true },
    { day: 'Thursday', open: '09:00', close: '16:00', isOpen: true },
    { day: 'Friday', open: '09:00', close: '16:00', isOpen: true },
    { day: 'Saturday', open: '09:00', close: '13:00', isOpen: true },
    { day: 'Sunday', open: '', close: '', isOpen: false },
  ];
  
  export const SCOOTERS: Scooter[] = [
    {
      id: 'single-1',
      type: 'single',
      name: 'Solo Cruiser',
      capacity: 1,
      pricePerDay: 50,
      priceCurrency: 'TOP',
      priceNZD: 35,
      description: 'Perfect for solo adventurers exploring the beautiful islands of Tonga.',
      features: [
        'Fuel-efficient engine',
        'Easy to handle',
        'Storage compartment',
        'Helmet included',
      ],
      available: 2,
      total: 2,
    },
    {
      id: 'double-1',
      type: 'double',
      name: 'Island Explorer',
      capacity: 2,
      pricePerDay: 70,
      priceCurrency: 'TOP',
      priceNZD: 49,
      description: 'Ideal for couples or friends wanting to discover Tonga together.',
      features: [
        'Comfortable for 2 riders',
        'Powerful engine',
        'Extra storage space',
        '2 helmets included',
      ],
      available: 0,
      total: 0,
    },
  ];
  
  export const FAQ_ITEMS = [
    {
      question: 'What documents do I need to rent a scooter?',
      answer: 'You need a valid driver\'s license (international or local) and a valid ID or passport. You must be at least 18 years old to rent.',
    },
    {
      question: 'Is insurance included?',
      answer: 'Yes! All our rentals include comprehensive insurance coverage for your peace of mind.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa card payments online for the booking deposit (8%). The remaining balance and security deposit (100 TOP) are paid in cash at pickup.',
    },
    {
      question: 'Can I extend my rental period?',
      answer: 'Yes, subject to availability. Please contact us via WhatsApp or phone to arrange an extension.',
    },
    {
      question: 'What happens if I return the scooter late?',
      answer: 'Late returns may incur additional daily charges. Please contact us if you need to adjust your return time.',
    },
    {
      question: 'Do you provide helmets?',
      answer: 'Yes, safety helmets are included with every rental at no extra charge.',
    },
    {
      question: 'What fuel should I use?',
      answer: 'All our scooters run on regular unleaded petrol. You receive a full tank and should return it at the same level.',
    },
    {
      question: 'Are your scooters suitable for beginners?',
      answer: 'Yes! Our scooters are easy to handle and perfect for beginners. We provide a quick orientation before you ride.',
    },
  ];
  
  // Helper functions
  export const formatCurrency = (amount: number, currency: 'TOP' | 'NZD' = 'TOP'): string => {
    return `${amount.toFixed(2)} ${currency}`;
  };
  
  export const calculateRentalDays = (pickup: Date, returnDate: Date): number => {
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };
  
  export const isValidPickupTime = (date: Date, time: string): boolean => {
    const dayOfWeek = date.getDay();
    const hours = BUSINESS_HOURS[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    
    if (!hours.isOpen) return false;
    
    const [hour, minute] = time.split(':').map(Number);
    const [openHour, openMinute] = hours.open.split(':').map(Number);
    const [closeHour, closeMinute] = hours.close.split(':').map(Number);
    
    const timeInMinutes = hour * 60 + minute;
    const openInMinutes = openHour * 60 + openMinute;
    const closeInMinutes = closeHour * 60 + closeMinute;
    
    return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
  };
  
  export const isSunday = (date: Date): boolean => {
    return date.getDay() === 0;
  };
  
  export const getNextValidDate = (date: Date): Date => {
    const newDate = new Date(date);
    while (isSunday(newDate)) {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  };
  