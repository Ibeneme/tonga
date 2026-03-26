import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        const { amount, currency = 'USD', booking_details } = await req.json()

        const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')?.trim()
        const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')?.trim()

        console.log('PayPal credentials check:', {
            hasClientId: !!PAYPAL_CLIENT_ID,
            clientIdLength: PAYPAL_CLIENT_ID?.length || 0,
            hasSecret: !!PAYPAL_CLIENT_SECRET,
            secretLength: PAYPAL_CLIENT_SECRET?.length || 0
        })

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

        // Create PayPal order
        const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2)
                    },
                    description: `Scooter Rental Deposit - ${booking_details?.scooterType || 'Scooter'} (${booking_details?.days || 1} day${booking_details?.days > 1 ? 's' : ''})`
                }]
            })
        })

        if (!orderResponse.ok) {
            const errorData = await orderResponse.json()
            console.error('PayPal order creation failed:', errorData)
            throw new Error('Failed to create PayPal order')
        }

        const order = await orderResponse.json()

        return new Response(
            JSON.stringify({ orderId: order.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: unknown) {
        console.error('Error creating PayPal order:', error)
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
