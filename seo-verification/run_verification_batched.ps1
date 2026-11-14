# SEO Production Redirect Verification Script - BATCHED
# Tests 162 unique paths x 4 host/protocol variants = 648 test cases
# Writes results incrementally after each path
# Read-only: no changes to code, config, redirects, Cloudflare, Caddy, or GSC

$ErrorActionPreference = "Continue"
$resultsFile = "D:\PROJECTS\msp-website\seo-verification\SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv"
$header = "TestNum,OriginalURL,Path,CrawlDate,Variant,Proto,Host,RedirectCount,RedirectHops,FinalStatus,FinalURL,CanonicalURL,Error"

# Initialize CSV with header
$header | Out-File -FilePath $resultsFile -Encoding UTF8

$testCount = 0
$totalTests = 162 * 4
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
    $pathResults = @()

    foreach ($variant in $variants) {
        $testCount++
        $testUrl = "$($variant.proto)://$($variant.host)$path"
        $hops = New-Object System.Collections.Generic.List[object]
        $currentUrl = $testUrl
        $finalStatus = $null
        $finalUrl = $null
        $errorMsg = $null
        $redirectCount = 0
        $maxHops = 10

        try {
            for ($hop = 0; $hop -lt $maxHops; $hop++) {
                try {
                    $resp = Invoke-WebRequest -Uri $currentUrl -Method GET -MaximumRedirection 0 -TimeoutSec 8 -ErrorAction Stop
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
                catch {
                    $errorMsg = $_.Exception.Message
                    $finalStatus = "ERROR"
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
                $htmlResp = Invoke-WebRequest -Uri $finalUrl -Method GET -TimeoutSec 8 -ErrorAction Stop
                $html = $htmlResp.Content
                $canonMatch = [regex]::Match($html, '<link\s+[^>]*rel\s*=\s*["'']canonical["''][^>]*href\s*=\s*["'']([^"'']+)["'']')
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
            $loc = $h.Location -replace ",", ";"
            $hopStr += "$($h.Hop):$($h.Status)[$($h.URL)]->$loc"
        }

        $csvLine = "$testCount`",""$testUrl`",""$path`",""$crawlDate`",""$($variant.proto)://$($variant.host)`",""$($variant.proto)`",""$($variant.host)`",$redirectCount`",""$hopStr`",$finalStatus`",""$finalUrl`",""$canonicalUrl`",""$errorMsg"
        $pathResults += $csvLine
    }

    # Append this path's results to CSV immediately
    $pathResults | Out-File -FilePath $resultsFile -Append -Encoding UTF8

    $pct = [math]::Round(($testCount / $totalTests) * 100, 1)
    Write-Host "Progress: $testCount / $totalTests ($pct%) - Last path: $path"
}

Write-Host "`n=== VERIFICATION COMPLETE ==="
$content = Get-Content $resultsFile
$total = ($content.Count - 1)
$success200 = ($content | Where-Object { $_ -match ',"200",' }).Count
$errors = ($content | Where-Object { $_ -match ',"ERROR",' }).Count
Write-Host "Total tests: $total"
Write-Host "Final status 200: $success200"
Write-Host "Errors: $errors"
Write-Host "Results: $resultsFile"
