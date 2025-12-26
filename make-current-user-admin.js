// Make Current User Admin - Run this in browser console
console.log('👤 Making Current User Admin');
console.log('============================');

// Step 1: Get current user
async function getCurrentUser() {
    console.log('🔍 Getting current user...');
    
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
        
        console.log('✅ User found:', user.email);
        console.log('📋 User ID:', user.id);
        
        return user;
    } catch (err) {
        console.error('❌ User check failed:', err);
        return false;
    }
}

// Step 2: Create or update user profile as admin
async function makeUserAdmin(user) {
    console.log('🔍 Making user admin...');
    
    try {
        // First, try to get existing user profile
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', user.id)
            .single();
            
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Error fetching user profile:', fetchError);
            return false;
        }
        
        if (existingUser) {
            // Update existing user to admin
            console.log('📝 Updating existing user to admin...');
            
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', user.id)
                .select()
                .single();
                
            if (updateError) {
                console.error('❌ Error updating user:', updateError);
                return false;
            }
            
            console.log('✅ User updated to admin:', updatedUser);
            return updatedUser;
        } else {
            // Create new user profile as admin
            console.log('📝 Creating new user profile as admin...');
            
            const { data: newUser, error: createError } = await supabase
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
            
            console.log('✅ User created as admin:', newUser);
            return newUser;
        }
    } catch (err) {
        console.error('❌ Make admin failed:', err);
        return false;
    }
}

// Step 3: Test admin access
async function testAdminAccess() {
    console.log('🔍 Testing admin access...');
    
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
        
        // Clean up
        await supabase.from('grades').delete().eq('id', newGrade.id);
        console.log('🧹 Test grade cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Admin access test failed:', err);
        return false;
    }
}

// Run all steps
async function makeCurrentUserAdmin() {
    console.log('🚀 Making current user admin...\n');
    
    const user = await getCurrentUser();
    if (!user) {
        console.log('❌ Please login first');
        return;
    }
    
    console.log('');
    
    const adminUser = await makeUserAdmin(user);
    if (!adminUser) {
        console.log('❌ Failed to make user admin');
        return;
    }
    
    console.log('');
    
    const adminAccess = await testAdminAccess();
    
    console.log('\n📊 Results:');
    console.log('===========');
    console.log(`User Found: ${user ? '✅' : '❌'}`);
    console.log(`Made Admin: ${adminUser ? '✅' : '❌'}`);
    console.log(`Admin Access: ${adminAccess ? '✅' : '❌'}`);
    
    if (adminUser && adminAccess) {
        console.log('\n🎉 Success! You are now an admin.');
        console.log('💡 You can now create subjects in the admin panel.');
    } else {
        console.log('\n⚠️ Something went wrong. Please:');
        console.log('1. Run the SQL script in Supabase');
        console.log('2. Refresh this page');
        console.log('3. Try again');
    }
    
    return { user, adminUser, adminAccess };
}

// Auto-run
makeCurrentUserAdmin();

// Export for manual use
window.makeAdmin = {
    getCurrentUser,
    makeUserAdmin,
    testAdminAccess,
    makeCurrentUserAdmin
};
