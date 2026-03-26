import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        const now = new Date()

        // Get all confirmed/active bookings
        const { data: bookings, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .in('status', ['confirmed', 'active'])

        if (fetchError) throw fetchError

        let expiredCount = 0

        for (const booking of (bookings || [])) {
            // Calculate expiry: pickup_date + pickup_time + (total_days * 24 hours)
            const pickupDateTime = new Date(`${booking.pickup_date}T${booking.pickup_time}:00`)
            const expiryDateTime = new Date(pickupDateTime.getTime() + booking.total_days * 24 * 60 * 60 * 1000)

            if (now > expiryDateTime) {
                const { error: updateError } = await supabase
                    .from('bookings')
                    .update({ status: 'completed' })
                    .eq('id', booking.id)

                if (!updateError) expiredCount++
            }
        }

        return new Response(
            JSON.stringify({ success: true, expired: expiredCount }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
