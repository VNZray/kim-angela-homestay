// Quick test to check if Supabase can see the users table
// Run this in your browser console on localhost:5173

import supabase from './utils/supabase';

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

    try {
        // Test 1: Check if table is accessible
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error accessing users table:', error);
            console.log('💡 Solution: Reload schema in Supabase Dashboard > API Settings');
            return false;
        }

        console.log('✅ users table is accessible!');
        console.log('📊 Sample data:', data);

        // Test 2: Check your specific user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('firebase_uid', 'KcpWaAyyfrckPDkhHI0nKFwxyR82')
            .single();

        if (userError) {
            console.error('❌ Error fetching your user:', userError);
            return false;
        }

        console.log('✅ Your user role:', userData);
        return true;

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return false;
    }
}

// Run the test
testSupabaseConnection();
