# Google Reviews Integration Setup Guide

This guide explains how to enable live Google Business Profile reviews on your website.

## Prerequisites

- A Google Business Profile for Nessco Tech Services
- Google Cloud Project with billing enabled
- Administrator access to the Business Profile

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Places API:
   - Navigate to APIs & Services > Library
   - Search for "Places API"
   - Click "Enable"

## Step 2: Create API Key

1. Navigate to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Copy the API key (you'll need this for environment variables)
4. Restrict the API key (recommended):
   - Click "Edit" on the API key
   - Under "Application restrictions", select "IP addresses"
   - Add your server IP addresses
   - Under "API restrictions", select "Places API"

## Step 3: Get Your Place ID

1. Go to [Google Business Profile](https://business.google.com/)
2. Find your business listing
3. Copy the Place ID from the URL or use the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

Example URL: `https://business.google.com/l/1234567890` → Place ID might be in the page source or use the finder tool.

## Step 4: Add Environment Variables

Add these to your environment (`.env.local` for development, production environment for live):

```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
```

## Step 5: Test the Integration

The API endpoint is already implemented at `/api/reviews`. Once you've added the environment variables:

1. Restart your development server
2. Visit `http://localhost:3000/api/reviews`
3. You should see live reviews from your Google Business Profile

## Features

- Automatic caching (24-hour revalidation)
- Rate limiting (prevents abuse)
- Fallback to curated testimonials if API fails
- Structured data for SEO

## Troubleshooting

**Reviews not showing:**
- Verify API key has Places API enabled
- Check Place ID is correct
- Ensure your Business Profile has reviews
- Check browser console for errors

**API errors:**
- Verify billing is enabled on Google Cloud project
- Check API key restrictions
- Ensure Place ID corresponds to an active Business Profile

## Security Notes

- Never commit API keys to git
- Use environment variables in production
- Restrict API key to specific IPs
- Monitor usage in Google Cloud Console
