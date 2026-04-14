
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dkphkxglzclxteqxufbv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcGhreGdsemNseHRlcXh1ZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODUxOTgsImV4cCI6MjA5MTI2MTE5OH0.OL4eitcwALg857bJqvjgLvpch0zTIxdCasjy9ScI0x4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  const { data, error } = await supabase.from('trips').select('*').limit(1)
  if (error) {
    console.error('Error fetching trips:', error)
    return
  }
  if (data && data.length > 0) {
    console.log('Columns in trips table:', Object.keys(data[0]))
  } else {
    console.log('No data in trips table to check columns.')
    // Try to insert a dummy row without destination to see if it works and what columns are rejected
    const { error: insertError } = await supabase.from('trips').insert([{ status: 'pending' }]).select()
    console.log('Insert error with status only:', insertError)
  }
}

checkSchema()
