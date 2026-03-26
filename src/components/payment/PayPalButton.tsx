import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  bookingData: {
    scooterType: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    totalDays: number;
    rentalFee: number;
    depositAmount: number;
    securityDeposit: number;
    remainingBalance: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PayPalButton = ({
  amount,
  currency = "USD",
  bookingData,
  onSuccess,
  onError,
  disabled,
}: PayPalButtonProps) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        setSdkReady(true);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the client ID from the edge function
        const { data, error } = await supabase.functions.invoke(
          "get-paypal-client-id"
        );
        if (error || !data?.clientId) {
          onError("Failed to load PayPal configuration");
          setIsLoading(false);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=${currency}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
          setIsLoading(false);
        };
        script.onerror = () => {
          onError("Failed to load PayPal SDK");
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } catch (err) {
        onError("Failed to load PayPal SDK");
        setIsLoading(false);
      }
    };

    loadPayPalScript();
  }, [currency, onError]);

  useEffect(() => {
    if (!sdkReady || !paypalRef.current || disabled) return;

    // Clear any existing buttons
    paypalRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 50,
        },
        createOrder: async () => {
          try {
            const { data, error } = await supabase.functions.invoke(
              "create-paypal-order",
              {
                body: {
                  amount,
                  currency,
                  booking_details: {
                    scooterType: bookingData.scooterType,
                    days: bookingData.totalDays,
                  },
                },
              }
            );

            if (error) throw new Error(error.message);
            if (!data?.orderId) throw new Error("No order ID returned");

            return data.orderId;
          } catch (err: any) {
            onError(err.message || "Failed to create order");
            throw err;
          }
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            const { data: captureData, error } =
              await supabase.functions.invoke("capture-paypal-order", {
                body: {
                  orderId: data.orderID,
                  booking_data: {
                    scooterType: bookingData.scooterType,
                    pickupDate: bookingData.pickupDate,
                    pickupTime: bookingData.pickupTime,
                    returnDate: bookingData.returnDate,
                    returnTime: bookingData.returnTime,
                    totalDays: bookingData.totalDays,
                    rentalFee: bookingData.rentalFee,
                    depositAmount: bookingData.depositAmount,
                    securityDeposit: bookingData.securityDeposit,
                    remainingBalance: bookingData.remainingBalance,
                    customerName: bookingData.customerName,
                    customerEmail: bookingData.customerEmail,
                    customerPhone: bookingData.customerPhone,
                  },
                },
              });

            if (error) throw new Error(error.message);
            if (!captureData?.success)
              throw new Error("Payment capture failed");

            onSuccess(data.orderID);
          } catch (err: any) {
            onError(err.message || "Payment failed");
          }
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          onError("Payment failed. Please try again.");
        },
        onCancel: () => {
          // User cancelled - no error needed
        },
      })
      .render(paypalRef.current);
  }, [sdkReady, amount, currency, bookingData, onSuccess, onError, disabled]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading PayPal...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={paypalRef}
      className={disabled ? "opacity-50 pointer-events-none" : ""}
    />
  );
};
