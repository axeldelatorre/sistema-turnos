// frontend/src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// ¡IMPORTANTE! Reemplaza estas variables con tus credenciales reales
const supabaseUrl = 'https://acwjuotojoxivrllxqco.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjd2p1b3Rvam94aXZybGx4cWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDI5MjEsImV4cCI6MjA3OTc3ODkyMX0.fOnghBE_d8PvmJFKYxEkiPGMB7fxXv9o-AYVJaFZyjA';

// Exporta el cliente que usarás para todas las consultas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);