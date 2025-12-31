import { useState, useCallback } from 'react';
import { Booking, SCOOTERS, Scooter } from '@/lib/booking';

// Simple in-memory store (would be replaced with database in production)
let bookings: Booking[] = [];
let scooterInventory = [...SCOOTERS];

export const useBookingStore = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [inventory, setInventory] = useState<Scooter[]>(scooterInventory);

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK-${Date.now()}`,
      createdAt: new Date(),
    };
    bookings = [...bookings, newBooking];
    setAllBookings([...bookings]);
    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    bookings = bookings.map(b => b.id === id ? { ...b, status } : b);
    setAllBookings([...bookings]);
  }, []);

  const getAvailableScooters = useCallback((type: 'single' | 'double', pickupDate: Date, returnDate: Date) => {
    const scooter = inventory.find(s => s.type === type);
    if (!scooter) return 0;

    // Count overlapping bookings
    const overlappingBookings = bookings.filter(b => {
      if (b.scooterType !== type) return false;
      if (b.status === 'cancelled') return false;
      
      const bookingStart = new Date(b.pickupDate);
      const bookingEnd = new Date(b.returnDate);
      
      return pickupDate < bookingEnd && returnDate > bookingStart;
    });

    return Math.max(0, scooter.available - overlappingBookings.length);
  }, [inventory]);

  const updateInventory = useCallback((type: 'single' | 'double', count: number) => {
    scooterInventory = scooterInventory.map(s => 
      s.type === type ? { ...s, available: count, total: count } : s
    );
    setInventory([...scooterInventory]);
  }, []);

  return {
    bookings: allBookings,
    inventory,
    addBooking,
    updateBookingStatus,
    getAvailableScooters,
    updateInventory,
  };
};
