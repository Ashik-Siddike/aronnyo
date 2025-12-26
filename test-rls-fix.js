// Test RLS fix - Run this in browser console
console.log('🔒 Testing RLS Fix');
console.log('==================');

// Test 1: Check if we can create a grade
async function testGradeCreation() {
    console.log('🔍 Testing grade creation...');
    
    try {
        const testGrade = {
            name: 'Test Grade ' + Date.now()
        };
        
        const { data: newGrade, error } = await supabase
            .from('grades')
            .insert([testGrade])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Grade creation failed:', error);
            return false;
        }
        
        console.log('✅ Grade created successfully:', newGrade);
        
        // Clean up
        await supabase.from('grades').delete().eq('id', newGrade.id);
        console.log('🧹 Test grade cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Grade creation test failed:', err);
        return false;
    }
}

// Test 2: Check if we can create a subject
async function testSubjectCreation() {
    console.log('🔍 Testing subject creation...');
    
    try {
        // Get a grade first
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError || !grades || grades.length === 0) {
            console.error('❌ No grades available for testing');
            return false;
        }
        
        const testSubject = {
            name: 'Test Subject ' + Date.now(),
            grade_id: grades[0].id
        };
        
        const { data: newSubject, error } = await supabase
            .from('subjects')
            .insert([testSubject])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Subject creation failed:', error);
            return false;
        }
        
        console.log('✅ Subject created successfully:', newSubject);
        
        // Clean up
        await supabase.from('subjects').delete().eq('id', newSubject.id);
        console.log('🧹 Test subject cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Subject creation test failed:', err);
        return false;
    }
}

// Test 3: Check current user
async function checkCurrentUser() {
    console.log('🔍 Checking current user...');
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('❌ Auth error:', error);
            return false;
        }
        
        if (!user) {
            console.log('⚠️ No authenticated user');
            return false;
        }
        
        console.log('✅ User authenticated:', user.email);
        console.log('📋 User ID:', user.id);
        
        return user;
    } catch (err) {
        console.error('❌ User check failed:', err);
        return false;
    }
}

// Run all tests
async function runRLSTest() {
    console.log('🚀 Running RLS fix test...\n');
    
    const user = await checkCurrentUser();
    if (!user) {
        console.log('❌ Please login first');
        return;
    }
    
    console.log('');
    
    const results = {
        gradeCreation: await testGradeCreation(),
        subjectCreation: await testSubjectCreation()
    };
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Grade Creation: ${results.gradeCreation ? '✅' : '❌'}`);
    console.log(`Subject Creation: ${results.subjectCreation ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 RLS fix successful! You can now create subjects.');
        console.log('💡 Try creating a subject in the admin panel.');
    } else {
        console.log('\n⚠️ RLS fix not working. You may need to:');
        console.log('1. Run the SQL script in Supabase');
        console.log('2. Check your database permissions');
        console.log('3. Verify you are logged in');
    }
    
    return results;
}

// Auto-run the test
runRLSTest();

// Export for manual use
window.rlsTest = {
    testGradeCreation,
    testSubjectCreation,
    checkCurrentUser,
    runRLSTest
};
