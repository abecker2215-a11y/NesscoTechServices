# SEO Production Redirect Verification - OPTIMIZED v2
# Pass 1: Test all 648 variants quickly with auto-redirect
# Pass 2: Trace redirect chains for 3xx responses
# Pass 3: Extract canonical URLs

$ErrorActionPreference = "Continue"
$resultsFile = "D:\PROJECTS\msp-website\seo-verification\SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv"

$pathLines = Get-Content -Path "D:\PROJECTS\msp-website\seo-verification\unique_paths.txt"

$variants = @(
    @{ proto = "https"; host = "nesscotech.com" },
    @{ proto = "https"; host = "www.nesscotech.com" },
    @{ proto = "http";  host = "nesscotech.com" },
    @{ proto = "http";  host = "www.nesscotech.com" }
)

$results = [System.Collections.Generic.List[object]]::new()
$testCount = 0
$totalTests = 162 * 4
$needsTracing = @{}

foreach ($line in $pathLines) {
    $parts = $line.Split(',', 2)
    $path = $parts[0]
    $crawlDate = $parts[1]

    foreach ($variant in $variants) {
        $testCount++
        $testUrl = "$($variant.proto)://$($variant.host)$path"
        $canonicalUrl = $null
        $errorMsg = $null

        try {
            $resp = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 10 -ErrorAction Stop
            $finalStatus = $resp.StatusCode
            $finalUrl = $resp.ResponseUri.ToString()

            if ($finalStatus -eq 200) {
                $canonMatch = [regex]::Match($resp.Content, '<link[^>]+rel\s*=\s*["'']canonical["''][^>]+href\s*=\s*["'']([^"'']+)["'']')
                if ($canonMatch.Success) { $canonicalUrl = $canonMatch.Groups[1].Value }
            }
        }
        catch {
            $finalStatus = "ERROR"
            $finalUrl = $testUrl
            $errorMsg = $_.Exception.Message
        }

        $results.Add([PSCustomObject]@{
            TestNum = $testCount
            OriginalURL = $testUrl
            Path = $path
            CrawlDate = $crawlDate
            Variant = "$($variant.proto)://$($variant.host)"
            Proto = $variant.proto
            Host = $variant.host
            RedirectCount = 0
            RedirectHops = "1:$finalStatus[$testUrl]->$finalUrl"
            FinalStatus = $finalStatus
            FinalURL = $finalUrl
            CanonicalURL = $canonicalUrl
            Error = $errorMsg
        })

        if ($finalStatus -match "^3" -or $finalStatus -eq "ERROR") {
            $needsTracing[$testCount] = @{
                path = $path; crawlDate = $crawlDate; variant = "$($variant.proto)://$($variant.host)"
                proto = $variant.proto; host = $variant.host; testUrl = $testUrl
            }
        }

        if ($testCount % 50 -eq 0) {
            Write-Host "Pass 1: $testCount / $totalTests"
        }
    }
}

Write-Host "Pass 1 complete. $($needsTracing.Count) URLs need detailed tracing."

# Pass 2: Trace redirect chains
foreach ($key in $needsTracing.Keys) {
    $dt = $needsTracing[$key]
    $currentUrl = $dt.testUrl
    $hops = New-Object System.Collections.Generic.List[object]
    $redirectCount = 0
    $finalStatus = $null
    $finalUrl = $null
    $errorMsg = $null
    $maxHops = 10

    try {
        for ($hop = 0; $hop -lt $maxHops; $hop++) {
            $resp = Invoke-WebRequest -Uri $currentUrl -Method GET -MaximumRedirection 0 -TimeoutSec 10 -ErrorAction Stop
            $statusCode = $resp.StatusCode
            $location = $resp.Headers["Location"]

            $hops.Add([PSCustomObject]@{ Hop = $hop+1; URL = $currentUrl; Status = $statusCode; Location = $location })

            if ($statusCode -ge 300 -and $statusCode -le 399 -and $location) {
                $redirectCount++
                if ($location -match '^https?://') { $currentUrl = $location }
                elseif ($location -match '^/') {
                    $uri = [Uri]$currentUrl
                    $currentUrl = "$($uri.Scheme)://$($uri.Host)$location"
                } else { $currentUrl = $location }
            } else {
                $finalStatus = $statusCode
                $finalUrl = $currentUrl
                break
            }
        }
        if ($hop -eq $maxHops) {
            $errorMsg = "MAX_HOPS_EXCEEDED"
            $finalStatus = "ERROR"
            $finalUrl = $currentUrl
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        $finalStatus = "ERROR"
        $finalUrl = $currentUrl
    }

    $hopStr = ""
    $first = $true
    foreach ($h in $hops) {
        if (-not $first) { $hopStr += " | " }
        $first = $false
        $loc = $h.Location -replace ",", ";"
        $hopStr += "$($h.Hop):$($h.Status)[$($h.URL)]->$loc"
    }

    # Update the result object
    $result = $results[$key - 1]
    $result.RedirectCount = $redirectCount
    $result.RedirectHops = $hopStr
    $result.FinalStatus = $finalStatus
    $result.FinalURL = $finalUrl
    $result.Error = $errorMsg
}

Write-Host "Pass 2 complete. Traced $($needsTracing.Count) redirect chains."

# Export to CSV
$results | Export-Csv -Path $resultsFile -NoTypeInformation -Encoding UTF8

# Summary
$total = $results.Count
$success200 = ($results | Where-Object { $_.FinalStatus -eq 200 }).Count
$redirects3xx = ($results | Where-Object { $_.FinalStatus -match "^3[0-9]{2}" }).Count
$errors = ($results | Where-Object { $_.FinalStatus -eq "ERROR" }).Count
$chains2plus = ($results | Where-Object { $_.RedirectCount -ge 2 }).Count

Write-Host "`n=== VERIFICATION COMPLETE ==="
Write-Host "Total tests: $total"
Write-Host "Final status 200: $success200"
Write-Host "Final status 3xx: $redirects3xx"
Write-Host "Errors: $errors"
Write-Host "Redirect chains (2+ hops): $chains2plus"
Write-Host "Results: $resultsFile"
