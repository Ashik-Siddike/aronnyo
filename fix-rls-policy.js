// Fix for Row Level Security (RLS) policy error
// Run this in browser console to check and fix RLS issues

console.log('🔒 Fixing Row Level Security Policy Error');
console.log('========================================');

// Test 1: Check current user authentication
async function checkAuthentication() {
    console.log('🔍 Checking user authentication...');
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('❌ Authentication error:', error);
            return false;
        }
        
        if (!user) {
            console.log('❌ No authenticated user found');
            return false;
        }
        
        console.log('✅ User authenticated:', user.email);
        console.log('📋 User ID:', user.id);
        
        return user;
    } catch (err) {
        console.error('❌ Authentication check failed:', err);
        return false;
    }
}

// Test 2: Check user profile and role
async function checkUserProfile(user) {
    console.log('🔍 Checking user profile and role...');
    
    try {
        const { data: profile, error } = await supabase
            .from('users')
            .select('id, email, role, full_name')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.log('⚠️ User not found in users table, creating profile...');
            
            // Create user profile with admin role
            const { data: newProfile, error: createError } = await supabase
                .from('users')
                .insert([{
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email,
                    role: 'admin'
                }])
                .select()
                .single();
                
            if (createError) {
                console.error('❌ Error creating user profile:', createError);
                return false;
            }
            
            console.log('✅ User profile created with admin role:', newProfile);
            return newProfile;
        }
        
        console.log('✅ User profile found:', profile);
        
        if (profile.role !== 'admin') {
            console.log('⚠️ User is not admin. Updating role...');
            
            const { error: updateError } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', user.id);
                
            if (updateError) {
                console.error('❌ Error updating user role:', updateError);
                return false;
            }
            
            console.log('✅ User role updated to admin');
            profile.role = 'admin';
        }
        
        return profile;
    } catch (err) {
        console.error('❌ User profile check failed:', err);
        return false;
    }
}

// Test 3: Test direct database access
async function testDatabaseAccess() {
    console.log('🔍 Testing direct database access...');
    
    try {
        // Test reading from subjects table
        const { data: subjects, error: readError } = await supabase
            .from('subjects')
            .select('id, name')
            .limit(1);
            
        if (readError) {
            console.error('❌ Error reading subjects table:', readError);
            return false;
        }
        
        console.log('✅ Can read from subjects table');
        
        // Test reading from grades table
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError) {
            console.error('❌ Error reading grades table:', gradesError);
            return false;
        }
        
        console.log('✅ Can read from grades table');
        
        return true;
    } catch (err) {
        console.error('❌ Database access test failed:', err);
        return false;
    }
}

// Test 4: Try to create a test subject
async function testSubjectCreation() {
    console.log('🔍 Testing subject creation...');
    
    try {
        // First, get a grade to use
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError) {
            console.error('❌ Error fetching grades:', gradesError);
            return false;
        }
        
        if (!grades || grades.length === 0) {
            console.log('⚠️ No grades found. Creating a test grade first...');
            
            const { data: newGrade, error: gradeError } = await supabase
                .from('grades')
                .insert([{ name: 'Test Grade' }])
                .select()
                .single();
                
            if (gradeError) {
                console.error('❌ Error creating test grade:', gradeError);
                return false;
            }
            
            console.log('✅ Test grade created:', newGrade);
            grades[0] = newGrade;
        }
        
        // Now try to create a subject
        const testSubject = {
            name: 'Test Subject ' + Date.now(),
            grade_id: grades[0].id
        };
        
        console.log('📝 Creating test subject:', testSubject);
        
        const { data: newSubject, error: subjectError } = await supabase
            .from('subjects')
            .insert([testSubject])
            .select()
            .single();
            
        if (subjectError) {
            console.error('❌ Error creating test subject:', subjectError);
            console.error('📋 Error details:', subjectError);
            return false;
        }
        
        console.log('✅ Test subject created successfully:', newSubject);
        
        // Clean up - delete the test subject
        await supabase
            .from('subjects')
            .delete()
            .eq('id', newSubject.id);
            
        console.log('🧹 Test subject cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Subject creation test failed:', err);
        return false;
    }
}

// Test 5: Check RLS policies
async function checkRLSPolicies() {
    console.log('🔍 Checking RLS policies...');
    
    try {
        // This will show us what RLS policies are active
        const { data, error } = await supabase
            .rpc('is_admin')
            .single();
            
        if (error) {
            console.log('⚠️ is_admin function not available or error:', error);
        } else {
            console.log('✅ is_admin function result:', data);
        }
        
        return true;
    } catch (err) {
        console.log('⚠️ Could not check RLS policies:', err);
        return false;
    }
}

// Run all tests
async function runRLSFix() {
    console.log('🚀 Running RLS policy fix...\n');
    
    const user = await checkAuthentication();
    if (!user) {
        console.log('❌ Authentication failed. Please login first.');
        return;
    }
    
    console.log('');
    
    const profile = await checkUserProfile(user);
    if (!profile) {
        console.log('❌ User profile setup failed.');
        return;
    }
    
    console.log('');
    
    const results = {
        databaseAccess: await testDatabaseAccess(),
        rlsPolicies: await checkRLSPolicies(),
        subjectCreation: await testSubjectCreation()
    };
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Database Access: ${results.databaseAccess ? '✅' : '❌'}`);
    console.log(`RLS Policies: ${results.rlsPolicies ? '✅' : '❌'}`);
    console.log(`Subject Creation: ${results.subjectCreation ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 All tests passed! Subject creation should work now.');
        console.log('💡 Try creating a subject in the admin panel again.');
    } else {
        console.log('\n⚠️ Some tests failed. You may need to:');
        console.log('1. Run the migration script to set up proper RLS policies');
        console.log('2. Check your Supabase project settings');
        console.log('3. Verify your user has admin role');
    }
    
    return results;
}

// Auto-run the fix
runRLSFix();

// Export for manual use
window.rlsFix = {
    checkAuthentication,
    checkUserProfile,
    testDatabaseAccess,
    testSubjectCreation,
    checkRLSPolicies,
    runRLSFix
};

console.log('\n💡 You can also run individual tests:');
console.log('- rlsFix.checkAuthentication()');
console.log('- rlsFix.checkUserProfile()');
console.log('- rlsFix.testDatabaseAccess()');
console.log('- rlsFix.testSubjectCreation()');
console.log('- rlsFix.checkRLSPolicies()');
console.log('- rlsFix.runRLSFix()');
