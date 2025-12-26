// Verify RLS Fix - Run this in browser console
console.log('🔒 Verifying RLS Fix');
console.log('====================');

// Test 1: Check authentication
async function checkAuth() {
    console.log('🔍 Checking authentication...');
    
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
        console.log('📋 User ID:', user.id);
        
        return user;
    } catch (err) {
        console.error('❌ Auth check failed:', err);
        return false;
    }
}

// Test 2: Test grade creation
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
        
        console.log('✅ Grade created:', newGrade);
        
        // Clean up
        await supabase.from('grades').delete().eq('id', newGrade.id);
        console.log('🧹 Test grade cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Grade creation test failed:', err);
        return false;
    }
}

// Test 3: Test subject creation
async function testSubjectCreation() {
    console.log('🔍 Testing subject creation...');
    
    try {
        // Get a grade
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError || !grades || grades.length === 0) {
            console.error('❌ No grades available');
            return false;
        }
        
        const testSubject = {
            name: 'Test Subject ' + Date.now(),
            grade_id: grades[0].id
        };
        
        console.log('📝 Creating subject:', testSubject);
        
        const { data: newSubject, error } = await supabase
            .from('subjects')
            .insert([testSubject])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Subject creation failed:', error);
            console.error('📋 Error details:', error);
            return false;
        }
        
        console.log('✅ Subject created:', newSubject);
        
        // Clean up
        await supabase.from('subjects').delete().eq('id', newSubject.id);
        console.log('🧹 Test subject cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Subject creation test failed:', err);
        return false;
    }
}

// Test 4: Check existing data
async function checkExistingData() {
    console.log('🔍 Checking existing data...');
    
    try {
        const [gradesResult, subjectsResult] = await Promise.all([
            supabase.from('grades').select('id, name'),
            supabase.from('subjects').select('id, name, grade_id')
        ]);
        
        if (gradesResult.error) {
            console.error('❌ Error fetching grades:', gradesResult.error);
        } else {
            console.log('✅ Grades found:', gradesResult.data?.length || 0);
            if (gradesResult.data && gradesResult.data.length > 0) {
                console.log('📋 Sample grade:', gradesResult.data[0]);
            }
        }
        
        if (subjectsResult.error) {
            console.error('❌ Error fetching subjects:', subjectsResult.error);
        } else {
            console.log('✅ Subjects found:', subjectsResult.data?.length || 0);
            if (subjectsResult.data && subjectsResult.data.length > 0) {
                console.log('📋 Sample subject:', subjectsResult.data[0]);
            }
        }
        
        return true;
    } catch (err) {
        console.error('❌ Data check failed:', err);
        return false;
    }
}

// Run all tests
async function runVerification() {
    console.log('🚀 Running RLS verification...\n');
    
    const user = await checkAuth();
    if (!user) {
        console.log('❌ Please login first');
        return;
    }
    
    console.log('');
    
    const results = {
        gradeCreation: await testGradeCreation(),
        subjectCreation: await testSubjectCreation(),
        existingData: await checkExistingData()
    };
    
    console.log('\n📊 Verification Results:');
    console.log('========================');
    console.log(`Grade Creation: ${results.gradeCreation ? '✅' : '❌'}`);
    console.log(`Subject Creation: ${results.subjectCreation ? '✅' : '❌'}`);
    console.log(`Existing Data: ${results.existingData ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 RLS fix verified! Everything is working.');
        console.log('💡 You can now create subjects in the admin panel.');
    } else {
        console.log('\n⚠️ RLS fix not complete. Please:');
        console.log('1. Run the complete SQL script in Supabase');
        console.log('2. Refresh this page');
        console.log('3. Try again');
    }
    
    return results;
}

// Auto-run verification
runVerification();

// Export for manual use
window.verifyRLS = {
    checkAuth,
    testGradeCreation,
    testSubjectCreation,
    checkExistingData,
    runVerification
};
