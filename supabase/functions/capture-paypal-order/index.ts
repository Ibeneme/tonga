import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId, booking_data } = await req.json()

    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured')
    }

    // Use sandbox for testing, change to api-m.paypal.com for production
    const PAYPAL_BASE_URL = 'https://api-m.paypal.com'

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.text()
      console.error('PayPal auth failed:', errorData)
      throw new Error('Failed to authenticate with PayPal')
    }

    const { access_token } = await authResponse.json()

    // Capture PayPal order
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      console.error('PayPal capture failed:', errorData)
      throw new Error('Failed to capture PayPal payment')
    }

    const captureData = await captureResponse.json()

    // Save booking to database
    if (booking_data) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          scooter_type: booking_data.scooterType,
          pickup_date: booking_data.pickupDate,
          pickup_time: booking_data.pickupTime,
          return_date: booking_data.returnDate,
          return_time: booking_data.returnTime,
          total_days: booking_data.totalDays,
          rental_fee: booking_data.rentalFee,
          deposit_amount: booking_data.depositAmount,
          security_deposit: booking_data.securityDeposit,
          remaining_balance: booking_data.remainingBalance,
          customer_name: booking_data.customerName,
          customer_email: booking_data.customerEmail,
          customer_phone: booking_data.customerPhone,
          status: 'confirmed',
          stripe_payment_id: orderId // We'll use this field for PayPal order ID too
        })

      if (insertError) {
        console.error('Failed to save booking:', insertError)
        // Payment was successful, so we don't want to fail the whole request
        // Just log the error
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        captureId: captureData.id,
        status: captureData.status 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Error capturing PayPal order:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
