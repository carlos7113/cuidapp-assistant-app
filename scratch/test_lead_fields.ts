
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dkphkxglzclxteqxufbv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcGhreGdsemNseHRlcXh1ZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODUxOTgsImV4cCI6MjA5MTI2MTE5OH0.OL4eitcwALg857bJqvjgLvpch0zTIxdCasjy9ScI0x4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLeadFields() {
  const { error } = await supabase.from('trips').insert([{ 
    lead_name: 'Test',
    lead_blood_type: 'O+',
    lead_allergies: 'None',
    lead_medications: 'None',
    lead_needs: ['wheelchair']
  }])
  console.log('Insert error with lead fields:', error)
}

testLeadFields()
