#!/bin/bash
# SEO Production Redirect Verification - curl based
# Tests 162 unique paths x 4 variants = 648 test cases
# Read-only verification

RESULTS_FILE="D:/PROJECTS/msp-website/seo-verification/SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv"
PATHS_FILE="D:/PROJECTS/msp-website/seo-verification/unique_paths.txt"

# Initialize CSV
echo "TestNum,OriginalURL,Path,CrawlDate,Variant,Proto,Host,RedirectCount,RedirectHops,FinalStatus,FinalURL,CanonicalURL,Error" > "$RESULTS_FILE"

testCount=0
totalTests=648

while IFS=',' read -r path crawlDate; do
    for variant in "https:nesscotech.com" "https:www.nesscotech.com" "http:nesscotech.com" "http:www.nesscotech.com"; do
        proto=$(echo "$variant" | cut -d: -f1)
        host=$(echo "$variant" | cut -d: -f2)
        testUrl="${proto}://${host}${path}"
        testCount=$((testCount + 1))
        
        currentUrl="$testUrl"
        finalStatus=""
        finalUrl=""
        errorMsg=""
        redirectCount=0
        hops=""
        maxHops=10
        
        for ((hop=1; hop<=maxHops; hop++)); do
            # Get headers only, follow no redirects
            headerOutput=$(curl -s -o /dev/null -D - --connect-timeout 8 --max-time 15 "$currentUrl" 2>/dev/null)
            if [ $? -ne 0 ]; then
                errorMsg="CURL_ERROR"
                finalStatus="ERROR"
                finalUrl="$currentUrl"
                break
            fi
            
            statusCode=$(echo "$headerOutput" | head -1 | awk '{print $2}')
            location=$(echo "$headerOutput" | grep -i "^location:" | sed 's/^location:[[:space:]]*//i' | tr -d '\r')
            
            hopStr="${hop}:${statusCode}[${currentUrl}]->${location}"
            if [ -z "$hops" ]; then
                hops="$hopStr"
            else
                hops="${hops} | ${hopStr}"
            fi
            
            if [ "$statusCode" -ge 300 ] 2>/dev/null && [ "$statusCode" -le 399 ] 2>/dev/null && [ -n "$location" ]; then
                redirectCount=$((redirectCount + 1))
                # Resolve relative Location
                if echo "$location" | grep -q '^https?://'; then
                    currentUrl="$location"
                elif echo "$location" | grep -q '^/'; then
                    currentUrl="${proto}://${host}${location}"
                else
                    currentUrl="$location"
                }
            else
                finalStatus="$statusCode"
                finalUrl="$currentUrl"
                break
            fi
        done
        
        if [ -z "$finalStatus" ]; then
            errorMsg="MAX_HOPS_EXCEEDED"
            finalStatus="ERROR"
            finalUrl="$currentUrl"
        fi
        
        # Get canonical URL if successful
        canonicalUrl=""
        if [ "$finalStatus" = "200" ] && [ -z "$errorMsg" ]; then
            canonicalUrl=$(curl -s --connect-timeout 8 --max-time 15 "$finalUrl" 2>/dev/null | grep -oP '<link[^>]+rel\s*=\s*["'"'"']canonical["'"'"'][^>]+href\s*=\s*["'"'"']([^"'"'"']+)["'"'"']' | head -1 | sed 's/.*href=["'"'"']\([^"'"'"']*\)["'"'"'].*/\1/')
        fi
        
        # Escape commas in fields for CSV
        hops_escaped=$(echo "$hops" | sed 's/,/;/g')
        finalUrl_escaped=$(echo "$finalUrl" | sed 's/,/;/g')
        canonicalUrl_escaped=$(echo "$canonicalUrl" | sed 's/,/;/g')
        errorMsg_escaped=$(echo "$errorMsg" | sed 's/,/;/g')
        
        echo "${testCount},\"${testUrl}\",\"${path}\",\"${crawlDate}\",\"${proto}://${host}\",\"${proto}\",\"${host}\",${redirectCount},\"${hops_escaped}\",\"${finalStatus}\",\"${finalUrl_escaped}\",\"${canonicalUrl_escaped}\",\"${errorMsg_escaped}\"" >> "$RESULTS_FILE"
        
        if [ $((testCount % 20)) -eq 0 ]; then
            echo "Progress: $testCount / $totalTests"
        fi
    done
done < "$PATHS_FILE"

echo "Verification complete. Results: $RESULTS_FILE"
