// Quick Test - Run this in browser console
console.log('🧪 Quick Test for RLS Fix');
console.log('==========================');

// Test subject creation
async function testSubjectCreation() {
    console.log('🔍 Testing subject creation...');
    
    try {
        // Get a grade first
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

// Run test
async function runQuickTest() {
    console.log('🚀 Running quick test...\n');
    
    const result = await testSubjectCreation();
    
    if (result) {
        console.log('\n🎉 RLS fix successful! You can now create subjects.');
        console.log('💡 Try creating a subject in the admin panel.');
    } else {
        console.log('\n⚠️ RLS fix not working. Please:');
        console.log('1. Run the SQL script in Supabase');
        console.log('2. Refresh this page');
        console.log('3. Try again');
    }
    
    return result;
}

// Auto-run
runQuickTest();

// Export
window.quickTest = { testSubjectCreation, runQuickTest };
