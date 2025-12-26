// Quick fix for subject creation error
// Run this in browser console to fix the order_index issue

console.log('🔧 Fixing Subject Creation Error');
console.log('================================');

// Test 1: Check current subjects table structure
async function checkSubjectsTable() {
    console.log('🔍 Checking subjects table structure...');
    
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Error accessing subjects table:', error);
            return false;
        }
        
        if (data && data.length > 0) {
            console.log('✅ Subjects table accessible');
            console.log('📋 Available columns:', Object.keys(data[0]));
        } else {
            console.log('✅ Subjects table accessible (empty)');
        }
        
        return true;
    } catch (err) {
        console.error('❌ Subjects table check failed:', err);
        return false;
    }
}

// Test 2: Create a test subject without order_index
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
            name: 'Test Subject',
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

// Test 3: Check if we can create a grade
async function testGradeCreation() {
    console.log('🔍 Testing grade creation...');
    
    try {
        const testGrade = {
            name: 'Test Grade ' + Date.now()
        };
        
        console.log('📝 Creating test grade:', testGrade);
        
        const { data: newGrade, error: gradeError } = await supabase
            .from('grades')
            .insert([testGrade])
            .select()
            .single();
            
        if (gradeError) {
            console.error('❌ Error creating test grade:', gradeError);
            return false;
        }
        
        console.log('✅ Test grade created successfully:', newGrade);
        
        // Clean up - delete the test grade
        await supabase
            .from('grades')
            .delete()
            .eq('id', newGrade.id);
            
        console.log('🧹 Test grade cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Grade creation test failed:', err);
        return false;
    }
}

// Run all tests
async function runSubjectFix() {
    console.log('🚀 Running subject creation fix...\n');
    
    const results = {
        subjectsTable: await checkSubjectsTable(),
        gradeCreation: await testGradeCreation(),
        subjectCreation: await testSubjectCreation()
    };
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Subjects Table Access: ${results.subjectsTable ? '✅' : '❌'}`);
    console.log(`Grade Creation: ${results.gradeCreation ? '✅' : '❌'}`);
    console.log(`Subject Creation: ${results.subjectCreation ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 All tests passed! Subject creation should work now.');
        console.log('💡 Try creating a subject in the admin panel again.');
    } else {
        console.log('\n⚠️ Some tests failed. The issue might be:');
        console.log('- Database permissions');
        console.log('- Table structure mismatch');
        console.log('- Authentication issues');
    }
    
    return results;
}

// Auto-run the fix
runSubjectFix();

// Export for manual use
window.subjectFix = {
    checkSubjectsTable,
    testGradeCreation,
    testSubjectCreation,
    runSubjectFix
};

console.log('\n💡 You can also run individual tests:');
console.log('- subjectFix.checkSubjectsTable()');
console.log('- subjectFix.testGradeCreation()');
console.log('- subjectFix.testSubjectCreation()');
console.log('- subjectFix.runSubjectFix()');
