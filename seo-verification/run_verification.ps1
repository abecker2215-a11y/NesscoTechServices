# SEO Production Redirect Verification Script
# Tests 162 unique paths x 4 host/protocol variants = 648 test cases
# Read-only: no changes to code, config, redirects, Cloudflare, Caddy, or GSC

$ErrorActionPreference = "Continue"
$results = [System.Collections.Generic.List[object]]::new()
$testCount = 0
$totalTests = 162 * 4

# Read unique paths with crawl dates
$pathLines = Get-Content -Path "D:\PROJECTS\msp-website\seo-verification\unique_paths.txt"

$variants = @(
    @{ proto = "https"; host = "nesscotech.com" },
    @{ proto = "https"; host = "www.nesscotech.com" },
    @{ proto = "http";  host = "nesscotech.com" },
    @{ proto = "http";  host = "www.nesscotech.com" }
)

foreach ($line in $pathLines) {
    $parts = $line.Split(',', 2)
    $path = $parts[0]
    $crawlDate = $parts[1]

    foreach ($variant in $variants) {
        $testCount++
        $testUrl = "$($variant.proto)://$($variant.host)$path"
        $hops = New-Object System.Collections.Generic.List[object]
        $currentUrl = $testUrl
        $finalStatus = $null
        $finalUrl = $null
        $errorMsg = $null
        $redirectCount = 0
        $maxHops = 20

        try {
            for ($hop = 0; $hop -lt $maxHops; $hop++) {
                $resp = Invoke-WebRequest -Uri $currentUrl -Method GET -MaximumRedirection 0 -TimeoutSec 15 -ErrorAction Stop
                $statusCode = $resp.StatusCode
                $location = $resp.Headers["Location"]

                $hopInfo = [PSCustomObject]@{
                    Hop = $hop + 1
                    URL = $currentUrl
                    Status = $statusCode
                    Location = $location
                }
                $hops.Add($hopInfo)

                if ($statusCode -ge 300 -and $statusCode -le 399 -and $location) {
                    $redirectCount++
                    if ($location -match '^https?://') {
                        $currentUrl = $location
                    } elseif ($location -match '^/') {
                        $uri = [Uri]$currentUrl
                        $currentUrl = "$($uri.Scheme)://$($uri.Host)$location"
                    } else {
                        $currentUrl = $location
                    }
                } else {
                    $finalStatus = $statusCode
                    $finalUrl = $currentUrl
                    break
                }
            }

            if ($hop -eq $maxHops) {
                $errorMsg = "Max redirect hops exceeded ($maxHops)"
            }
        }
        catch {
            $errorMsg = $_.Exception.Message
            $finalStatus = "ERROR"
            $finalUrl = $testUrl
        }

        # Get canonical URL from final HTML if successful
        $canonicalUrl = $null
        if ($finalStatus -eq 200 -and -not $errorMsg) {
            try {
                $htmlResp = Invoke-WebRequest -Uri $finalUrl -Method GET -TimeoutSec 15 -ErrorAction Stop
                $html = $htmlResp.Content
                $canonMatch = [regex]::Match($html, '<link[^>]+rel\s*=\s*["'']canonical["''][^>]+href\s*=\s*["'']([^"'']+)["'']')
                if ($canonMatch.Success) {
                    $canonicalUrl = $canonMatch.Groups[1].Value
                }
            }
            catch {
                # Canonical extraction failed, not critical
            }
        }

        $hopStr = ""
        $first = $true
        foreach ($h in $hops) {
            if (-not $first) { $hopStr += " | " }
            $first = $false
            $hopStr += "$($h.Hop):$($h.Status)[$($h.URL)]->$($h.Location)"
        }

        $result = [PSCustomObject]@{
            TestNum = $testCount
            OriginalURL = $testUrl
            Path = $path
            CrawlDate = $crawlDate
            Variant = "$($variant.proto)://$($variant.host)"
            Proto = $variant.proto
            Host = $variant.host
            RedirectCount = $redirectCount
            RedirectHops = $hopStr
            FinalStatus = $finalStatus
            FinalURL = $finalUrl
            CanonicalURL = $canonicalUrl
            Error = $errorMsg
        }
        $results.Add($result)

        Write-Progress -Activity "Testing URLs" -Status "$testCount / $totalTests" -PercentComplete (($testCount / $totalTests) * 100)
    }
}

Write-Progress -Completed

# Output results
$results | Export-Csv -Path "D:\PROJECTS\msp-website\seo-verification\SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv" -NoTypeInformation -Encoding UTF8

# Summary
$total = $results.Count
$success200 = ($results | Where-Object { $_.FinalStatus -eq 200 }).Count
$redirects3xx = ($results | Where-Object { $_.FinalStatus -match "^3[0-9]{2}" }).Count
$errors = ($results | Where-Object { $_.FinalStatus -eq "ERROR" }).Count
$chains2plus = ($results | Where-Object { $_.RedirectCount -ge 2 }).Count

Write-Host "`n=== VERIFICATION SUMMARY ==="
Write-Host "Total tests: $total"
Write-Host "Final status 200: $success200"
Write-Host "Final status 3xx: $redirects3xx"
Write-Host "Errors: $errors"
Write-Host "Redirect chains (2+ hops): $chains2plus"
Write-Host "Results exported to: D:\PROJECTS\msp-website\seo-verification\SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv"
