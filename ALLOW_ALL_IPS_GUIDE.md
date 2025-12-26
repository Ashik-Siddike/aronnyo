# সব IP থেকে Access করার Guide

## Supabase Dashboard Settings

### 1. Network Restrictions Check করুন

1. **Supabase Dashboard** এ যান: https://supabase.com/dashboard
2. আপনার project select করুন (`247-school`)
3. **Settings** → **Network Restrictions** এ যান
4. **IP Allowlist** disable করুন (যদি enable থাকে)
   - Default-ই disabled থাকে, তাই সব IP থেকে access হবে
   - যদি specific IPs allowlist করা থাকে, সেগুলো remove করুন

### 2. CORS Settings Verify করুন

1. **Settings** → **API** → **CORS** section
2. আপনার production domain add করুন:
   ```
   https://24-7-school.netlify.app
   https://your-domain.com
   ```
3. Development-এর জন্য localhost allow করুন:
   ```
   http://localhost:8080
   http://localhost:5173
   http://127.0.0.1:8080
   ```

### 3. RLS Policies Verify করুন

Admin user-এর জন্য RLS policies ঠিক আছে কিনা check করুন:

```sql
-- Check admin policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('users', 'contents', 'grades', 'subjects')
AND policyname LIKE '%admin%' OR policyname LIKE '%Admin%';
```

## Code Level Settings

### Environment Variables

`.env` file-এ verify করুন:

```env
VITE_SUPABASE_URL=https://ededavyhrbhabqswgxbn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Supabase Client Configuration

`src/integrations/supabase/client.ts` file-এ:

```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  // Global headers (optional)
  global: {
    headers: {
      'X-Client-Info': 'play-learn-grow-kids',
    },
  },
});
```

## Deployment Settings

### Netlify Environment Variables

Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://ededavyhrbhabqswgxbn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Netlify Headers (Optional)

`netlify.toml` file-এ headers add করুন:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Authorization, Content-Type"
```

## Verification Steps

### 1. Test from Different IPs

- Mobile data থেকে test করুন
- Different WiFi network থেকে test করুন
- VPN use করে test করুন

### 2. Check Browser Console

F12 → Console tab-এ check করুন:
- CORS errors আছে কিনা
- Network errors আছে কিনা
- Authentication errors আছে কিনা

### 3. Check Supabase Logs

Supabase Dashboard → Logs → API:
- Recent requests check করুন
- Error logs দেখুন
- Response times check করুন

## Common Issues & Solutions

### Issue 1: CORS Error

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
1. Supabase Dashboard → Settings → API → CORS
2. আপনার domain add করুন
3. Save করুন

### Issue 2: Network Restrictions

**Error:** `Connection refused` or `403 Forbidden`

**Solution:**
1. Settings → Network Restrictions
2. IP Allowlist disable করুন
3. Save করুন

### Issue 3: RLS Policy Blocking

**Error:** `new row violates row-level security policy`

**Solution:**
1. Verify admin user role: `SELECT role FROM users WHERE email = 'ashiksiddike@gmail.com';`
2. Check RLS policies: Admin policies exist কিনা
3. Run migration to fix policies

## Security Best Practices

### ✅ Recommended Settings

1. **CORS:** Specific domains allow করুন (production + development)
2. **RLS:** Always enabled (data security)
3. **Network Restrictions:** Disable (unless specific IPs needed)
4. **API Keys:** Never expose service_role key in frontend

### ⚠️ Security Notes

- সব IP allow করা security risk হতে পারে
- Production-এ specific domains allow করুন
- Service role key কখনো frontend-এ use করবেন না
- Regular security audits করুন

## Quick Checklist

- [ ] Network Restrictions disabled
- [ ] CORS settings configured
- [ ] Environment variables set
- [ ] RLS policies verified
- [ ] Admin user role confirmed
- [ ] Tested from different IPs
- [ ] No console errors
- [ ] Supabase logs clean

## Support

যদি সমস্যা থাকে:
1. Browser console errors check করুন
2. Supabase logs check করুন
3. Network tab-এ requests verify করুন
4. RLS policies double-check করুন


