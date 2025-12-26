// Debug script for dropdown display issue
// Run this in browser console to check dropdown problems

console.log('🔍 Debugging Dropdown Display Issue');
console.log('===================================');

// Test 1: Check grades data
async function checkGradesData() {
    console.log('🔍 Checking grades data...');
    
    try {
        const { data: grades, error } = await supabase
            .from('grades')
            .select('id, name')
            .order('id');
            
        if (error) {
            console.error('❌ Error fetching grades:', error);
            return false;
        }
        
        console.log('✅ Grades data:', grades);
        console.log('📊 Total grades:', grades.length);
        
        if (grades.length > 0) {
            console.log('📋 Sample grade:', grades[0]);
            console.log('🔢 Grade ID type:', typeof grades[0].id);
            console.log('📝 Grade name:', grades[0].name);
        }
        
        return grades;
    } catch (err) {
        console.error('❌ Grades check failed:', err);
        return false;
    }
}

// Test 2: Check subjects data
async function checkSubjectsData() {
    console.log('🔍 Checking subjects data...');
    
    try {
        const { data: subjects, error } = await supabase
            .from('subjects')
            .select('id, name, grade_id')
            .order('id');
            
        if (error) {
            console.error('❌ Error fetching subjects:', error);
            return false;
        }
        
        console.log('✅ Subjects data:', subjects);
        console.log('📊 Total subjects:', subjects.length);
        
        if (subjects.length > 0) {
            console.log('📋 Sample subject:', subjects[0]);
            console.log('🔢 Subject ID type:', typeof subjects[0].id);
            console.log('🔢 Grade ID type:', typeof subjects[0].grade_id);
        }
        
        return subjects;
    } catch (err) {
        console.error('❌ Subjects check failed:', err);
        return false;
    }
}

// Test 3: Check form state
function checkFormState() {
    console.log('🔍 Checking form state...');
    
    // This will only work if you're on the admin page
    if (typeof window !== 'undefined' && window.React) {
        console.log('✅ React is available');
    } else {
        console.log('⚠️ React not available in console context');
    }
    
    // Check if we can access the component state
    console.log('💡 To check form state, open React DevTools and inspect the component');
}

// Test 4: Create sample data if needed
async function createSampleData() {
    console.log('🔍 Creating sample data if needed...');
    
    try {
        // Check if grades exist
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError) {
            console.error('❌ Error checking grades:', gradesError);
            return false;
        }
        
        if (!grades || grades.length === 0) {
            console.log('📝 No grades found, creating sample grades...');
            
            const sampleGrades = [
                { name: '1st Standard' },
                { name: '2nd Standard' },
                { name: '3rd Standard' }
            ];
            
            const { data: newGrades, error: insertError } = await supabase
                .from('grades')
                .insert(sampleGrades)
                .select();
                
            if (insertError) {
                console.error('❌ Error creating grades:', insertError);
                return false;
            }
            
            console.log('✅ Sample grades created:', newGrades);
        } else {
            console.log('✅ Grades already exist');
        }
        
        return true;
    } catch (err) {
        console.error('❌ Sample data creation failed:', err);
        return false;
    }
}

// Test 5: Check dropdown rendering
function checkDropdownRendering() {
    console.log('🔍 Checking dropdown rendering...');
    
    // Look for select elements on the page
    const selects = document.querySelectorAll('select, [role="combobox"]');
    console.log('📊 Found select elements:', selects.length);
    
    selects.forEach((select, index) => {
        console.log(`Select ${index + 1}:`, {
            element: select,
            value: select.value,
            options: select.options?.length || 'N/A',
            placeholder: select.placeholder || 'N/A'
        });
    });
    
    // Look for shadcn/ui select components
    const selectTriggers = document.querySelectorAll('[data-radix-collection-item]');
    console.log('📊 Found Radix select items:', selectTriggers.length);
    
    return selects.length > 0;
}

// Run all tests
async function runDropdownDebug() {
    console.log('🚀 Running dropdown debug...\n');
    
    const results = {
        gradesData: await checkGradesData(),
        subjectsData: await checkSubjectsData(),
        sampleData: await createSampleData(),
        dropdownRendering: checkDropdownRendering()
    };
    
    console.log('\n📊 Debug Results:');
    console.log('==================');
    console.log(`Grades Data: ${results.gradesData ? '✅' : '❌'}`);
    console.log(`Subjects Data: ${results.subjectsData ? '✅' : '❌'}`);
    console.log(`Sample Data: ${results.sampleData ? '✅' : '❌'}`);
    console.log(`Dropdown Rendering: ${results.dropdownRendering ? '✅' : '❌'}`);
    
    // Provide recommendations
    console.log('\n💡 Recommendations:');
    if (!results.gradesData) {
        console.log('- Create some grades first');
    }
    if (!results.subjectsData) {
        console.log('- Create some subjects after creating grades');
    }
    if (!results.dropdownRendering) {
        console.log('- Check if you\'re on the correct admin page');
    }
    
    console.log('\n🔧 Common fixes:');
    console.log('- Refresh the page after creating grades');
    console.log('- Check browser console for React errors');
    console.log('- Verify you\'re logged in as admin');
    
    return results;
}

// Auto-run the debug
runDropdownDebug();

// Export for manual use
window.dropdownDebug = {
    checkGradesData,
    checkSubjectsData,
    checkFormState,
    createSampleData,
    checkDropdownRendering,
    runDropdownDebug
};

console.log('\n💡 You can also run individual tests:');
console.log('- dropdownDebug.checkGradesData()');
console.log('- dropdownDebug.checkSubjectsData()');
console.log('- dropdownDebug.createSampleData()');
console.log('- dropdownDebug.checkDropdownRendering()');
console.log('- dropdownDebug.runDropdownDebug()');
