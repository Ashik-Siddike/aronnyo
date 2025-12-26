// Test Ashik Admin - Run this in browser console
console.log('👤 Testing Ashik Admin Access');
console.log('=============================');

// Test current user admin status
async function checkAshikAdmin() {
    console.log('🔍 Checking Ashik admin status...');
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('❌ Auth error:', error);
            return false;
        }
        
        if (!user) {
            console.log('⚠️ No user logged in');
            return false;
        }
        
        console.log('✅ User logged in:', user.email);
        
        // Check if user is ashiksiddike@gmail.com
        if (user.email !== 'ashiksiddike@gmail.com') {
            console.log('⚠️ Not Ashik\'s email. Current email:', user.email);
            console.log('💡 Please login with ashiksiddike@gmail.com');
            return false;
        }
        
        // Check admin role
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', user.id)
            .single();
            
        if (profileError) {
            console.error('❌ Profile check failed:', profileError);
            return false;
        }
        
        console.log('✅ User profile:', profile);
        
        if (profile.role !== 'admin') {
            console.log('⚠️ User is not admin. Role:', profile.role);
            console.log('💡 Please run the SQL script to make user admin');
            return false;
        }
        
        console.log('✅ Ashik is admin!');
        return true;
    } catch (err) {
        console.error('❌ Admin check failed:', err);
        return false;
    }
}

// Test admin functionality
async function testAdminFunctionality() {
    console.log('🔍 Testing admin functionality...');
    
    try {
        // Test grade creation
        const testGrade = {
            name: 'Test Grade ' + Date.now()
        };
        
        const { data: newGrade, error: gradeError } = await supabase
            .from('grades')
            .insert([testGrade])
            .select()
            .single();
            
        if (gradeError) {
            console.error('❌ Grade creation failed:', gradeError);
            return false;
        }
        
        console.log('✅ Grade created:', newGrade);
        
        // Test subject creation
        const testSubject = {
            name: 'Test Subject ' + Date.now(),
            grade_id: newGrade.id
        };
        
        const { data: newSubject, error: subjectError } = await supabase
            .from('subjects')
            .insert([testSubject])
            .select()
            .single();
            
        if (subjectError) {
            console.error('❌ Subject creation failed:', subjectError);
            return false;
        }
        
        console.log('✅ Subject created:', newSubject);
        
        // Clean up
        await supabase.from('subjects').delete().eq('id', newSubject.id);
        await supabase.from('grades').delete().eq('id', newGrade.id);
        console.log('🧹 Test data cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Admin functionality test failed:', err);
        return false;
    }
}

// Run all tests
async function runAshikAdminTest() {
    console.log('🚀 Running Ashik admin test...\n');
    
    const isAdmin = await checkAshikAdmin();
    if (!isAdmin) {
        console.log('❌ Ashik is not admin or not logged in');
        console.log('💡 Please:');
        console.log('1. Login with ashiksiddike@gmail.com');
        console.log('2. Run the SQL script to make user admin');
        console.log('3. Refresh this page');
        return;
    }
    
    console.log('');
    
    const functionality = await testAdminFunctionality();
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Ashik Admin Status: ${isAdmin ? '✅' : '❌'}`);
    console.log(`Admin Functionality: ${functionality ? '✅' : '❌'}`);
    
    if (isAdmin && functionality) {
        console.log('\n🎉 Ashik admin setup successful!');
        console.log('💡 All admin panel issues should be resolved now.');
        console.log('📧 Email: ashiksiddike@gmail.com');
        console.log('🔑 Role: admin');
    } else {
        console.log('\n⚠️ Admin setup incomplete. Please:');
        console.log('1. Run the SQL script in Supabase');
        console.log('2. Login with ashiksiddike@gmail.com');
        console.log('3. Refresh this page');
    }
    
    return { isAdmin, functionality };
}

// Auto-run
runAshikAdminTest();

// Export
window.ashikAdminTest = {
    checkAshikAdmin,
    testAdminFunctionality,
    runAshikAdminTest
};
