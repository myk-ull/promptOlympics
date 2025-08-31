# Vercel Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Navigate to your project in Vercel
- Click on "Settings" tab
- Click on "Environment Variables" in the left sidebar

### 2. Add These Environment Variables

Copy these EXACT values (WITHOUT quotes):

#### NEXT_PUBLIC_SUPABASE_URL
```
https://lzrzoaxspilzkrqjrlwp.supabase.co
```

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cnpvYXhzcGlsemtycWpybHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzM3NjUsImV4cCI6MjA3MjIwOTc2NX0.Nnb-BGVXJkXk_mkgm1QMzBzS1cgKBtJhe9wM3w9e3tY
```

#### NEXTAUTH_URL (for email confirmations)
```
https://your-project-name.vercel.app
```
Replace `your-project-name` with your actual Vercel project URL

### 3. Important Settings
- **Environment**: Select all three checkboxes:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

### 4. After Adding Variables
- Click "Save" for each variable
- **IMPORTANT**: You MUST redeploy for changes to take effect

### 5. Trigger Redeploy
Two ways to redeploy:
1. **From Vercel Dashboard**: 
   - Go to "Deployments" tab
   - Click the three dots menu on the latest deployment
   - Select "Redeploy"
   
2. **Push a commit** (which we'll do with this file)

## Troubleshooting

### If Variables Still Don't Work:
1. Check for typos in variable names (they're case-sensitive)
2. Make sure no extra spaces before/after the values
3. Ensure you selected all environments (Production, Preview, Development)
4. Verify you redeployed after adding variables

### To Verify Setup:
After deployment, check browser console for:
```
Environment check:
NEXT_PUBLIC_SUPABASE_URL: SET
NEXT_PUBLIC_SUPABASE_ANON_KEY: SET (hidden)
```

If you see "NOT SET", the variables aren't configured correctly.