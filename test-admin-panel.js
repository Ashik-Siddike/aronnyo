// Test script for Admin Panel functionality
// Run this in your browser console on the admin pages

console.log('🧪 Admin Panel Test Script');
console.log('========================');

// Test 1: Check if Supabase client is working
async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('grades').select('count').limit(1);
        if (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }
        console.log('✅ Supabase connection successful');
        return true;
    } catch (err) {
        console.error('❌ Supabase connection error:', err);
        return false;
    }
}

// Test 2: Check if user is admin
async function testAdminAccess() {
    console.log('🔍 Testing admin access...');
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('❌ No authenticated user');
            return false;
        }
        
        const { data: profile, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.error('❌ Error fetching user profile:', error);
            return false;
        }
        
        if (profile.role !== 'admin') {
            console.error('❌ User is not admin. Role:', profile.role);
            return false;
        }
        
        console.log('✅ Admin access confirmed');
        return true;
    } catch (err) {
        console.error('❌ Admin access test error:', err);
        return false;
    }
}

// Test 3: Check database schema
async function testDatabaseSchema() {
    console.log('🔍 Testing database schema...');
    const tests = [
        { table: 'grades', requiredFields: ['id', 'name'] },
        { table: 'subjects', requiredFields: ['id', 'name', 'grade_id'] },
        { table: 'contents', requiredFields: ['id', 'title', 'content_type'] },
        { table: 'users', requiredFields: ['id', 'email', 'role'] }
    ];
    
    let allPassed = true;
    
    for (const test of tests) {
        try {
            const { data, error } = await supabase
                .from(test.table)
                .select(test.requiredFields.join(', '))
                .limit(1);
                
            if (error) {
                console.error(`❌ Table ${test.table} test failed:`, error);
                allPassed = false;
            } else {
                console.log(`✅ Table ${test.table} schema OK`);
            }
        } catch (err) {
            console.error(`❌ Table ${test.table} error:`, err);
            allPassed = false;
        }
    }
    
    return allPassed;
}

// Test 4: Check sample data
async function testSampleData() {
    console.log('🔍 Testing sample data...');
    try {
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(5);
            
        if (gradesError) {
            console.error('❌ Error fetching grades:', gradesError);
            return false;
        }
        
        console.log(`✅ Found ${grades.length} grades:`, grades.map(g => g.name));
        
        if (grades.length === 0) {
            console.warn('⚠️ No grades found. Run the migration script to add sample data.');
        }
        
        return true;
    } catch (err) {
        console.error('❌ Sample data test error:', err);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting admin panel tests...\n');
    
    const results = {
        supabase: await testSupabaseConnection(),
        admin: await testAdminAccess(),
        schema: await testDatabaseSchema(),
        data: await testSampleData()
    };
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Supabase Connection: ${results.supabase ? '✅' : '❌'}`);
    console.log(`Admin Access: ${results.admin ? '✅' : '❌'}`);
    console.log(`Database Schema: ${results.schema ? '✅' : '❌'}`);
    console.log(`Sample Data: ${results.data ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 All tests passed! Admin panel is ready to use.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the errors above and fix them.');
        console.log('\n💡 Common fixes:');
        console.log('- Run the migration script in Supabase SQL Editor');
        console.log('- Login with admin credentials (ashik/ashik123)');
        console.log('- Check browser console for detailed errors');
    }
    
    return results;
}

// Auto-run tests when script loads
runAllTests();

// Export functions for manual testing
window.adminPanelTests = {
    testSupabaseConnection,
    testAdminAccess,
    testDatabaseSchema,
    testSampleData,
    runAllTests
};

console.log('\n💡 You can also run individual tests:');
console.log('- adminPanelTests.testSupabaseConnection()');
console.log('- adminPanelTests.testAdminAccess()');
console.log('- adminPanelTests.testDatabaseSchema()');
console.log('- adminPanelTests.testSampleData()');
console.log('- adminPanelTests.runAllTests()');
