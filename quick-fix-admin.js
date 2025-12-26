// Quick fix for admin panel - run this in browser console
// This will help you test the admin panel without running the full migration

console.log('🔧 Quick Admin Panel Fix');
console.log('========================');

// Test 1: Check current database schema
async function checkCurrentSchema() {
    console.log('🔍 Checking current database schema...');
    
    try {
        // Test each table
        const tables = ['users', 'grades', 'subjects', 'contents'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.error(`❌ Table ${table} error:`, error.message);
                } else {
                    console.log(`✅ Table ${table} accessible`);
                    if (data && data.length > 0) {
                        console.log(`   Sample data:`, Object.keys(data[0]));
                    }
                }
            } catch (err) {
                console.error(`❌ Table ${table} exception:`, err);
            }
        }
    } catch (err) {
        console.error('❌ Schema check failed:', err);
    }
}

// Test 2: Create sample data if needed
async function createSampleData() {
    console.log('🔍 Creating sample data...');
    
    try {
        // Check if grades exist
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select('id, name')
            .limit(1);
            
        if (gradesError) {
            console.error('❌ Error checking grades:', gradesError);
            return;
        }
        
        if (!grades || grades.length === 0) {
            console.log('📝 No grades found, creating sample grades...');
            
            const sampleGrades = [
                { name: '1st Standard' },
                { name: '2nd Standard' },
                { name: '3rd Standard' },
                { name: '4th Standard' },
                { name: '5th Standard' }
            ];
            
            const { data: newGrades, error: insertError } = await supabase
                .from('grades')
                .insert(sampleGrades)
                .select();
                
            if (insertError) {
                console.error('❌ Error creating grades:', insertError);
            } else {
                console.log('✅ Sample grades created:', newGrades);
            }
        } else {
            console.log('✅ Grades already exist:', grades.length);
        }
        
        // Check if subjects exist
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('id, name')
            .limit(1);
            
        if (subjectsError) {
            console.error('❌ Error checking subjects:', subjectsError);
            return;
        }
        
        if (!subjects || subjects.length === 0) {
            console.log('📝 No subjects found, creating sample subjects...');
            
            // Get the first grade
            const { data: firstGrade } = await supabase
                .from('grades')
                .select('id')
                .limit(1)
                .single();
                
            if (firstGrade) {
                const sampleSubjects = [
                    { name: 'Mathematics', grade_id: firstGrade.id },
                    { name: 'English', grade_id: firstGrade.id },
                    { name: 'Science', grade_id: firstGrade.id },
                    { name: 'Bangla', grade_id: firstGrade.id }
                ];
                
                const { data: newSubjects, error: insertError } = await supabase
                    .from('subjects')
                    .insert(sampleSubjects)
                    .select();
                    
                if (insertError) {
                    console.error('❌ Error creating subjects:', insertError);
                } else {
                    console.log('✅ Sample subjects created:', newSubjects);
                }
            }
        } else {
            console.log('✅ Subjects already exist:', subjects.length);
        }
        
    } catch (err) {
        console.error('❌ Sample data creation failed:', err);
    }
}

// Test 3: Check admin user
async function checkAdminUser() {
    console.log('🔍 Checking admin user...');
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.log('⚠️ No authenticated user. Please login first.');
            return;
        }
        
        console.log('✅ User authenticated:', user.email);
        
        // Check if user exists in users table
        const { data: userProfile, error } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.log('⚠️ User not found in users table, creating profile...');
            
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([{
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email,
                    role: 'admin' // Set as admin for testing
                }])
                .select()
                .single();
                
            if (insertError) {
                console.error('❌ Error creating user profile:', insertError);
            } else {
                console.log('✅ User profile created:', newUser);
            }
        } else {
            console.log('✅ User profile found:', userProfile);
            
            if (userProfile.role !== 'admin') {
                console.log('⚠️ User is not admin. Updating role...');
                
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ role: 'admin' })
                    .eq('id', user.id);
                    
                if (updateError) {
                    console.error('❌ Error updating user role:', updateError);
                } else {
                    console.log('✅ User role updated to admin');
                }
            }
        }
        
    } catch (err) {
        console.error('❌ Admin user check failed:', err);
    }
}

// Run all fixes
async function runQuickFix() {
    console.log('🚀 Running quick admin panel fix...\n');
    
    await checkCurrentSchema();
    console.log('');
    
    await createSampleData();
    console.log('');
    
    await checkAdminUser();
    console.log('');
    
    console.log('✅ Quick fix completed!');
    console.log('💡 Try refreshing the admin dashboard now.');
    console.log('💡 If you still see errors, run the full migration script.');
}

// Auto-run the fix
runQuickFix();

// Export for manual use
window.quickAdminFix = {
    checkCurrentSchema,
    createSampleData,
    checkAdminUser,
    runQuickFix
};
