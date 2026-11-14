# SEO Production Redirect Verification - CURL BASED
# Uses curl.exe (verified working) instead of Invoke-WebRequest
# Tests 162 unique paths x 4 variants = 648 test cases

$ErrorActionPreference = "Continue"
$resultsFile = "D:\PROJECTS\msp-website\seo-verification\SEO_PRODUCTION_REDIRECT_RESULTS_2026-11-12.csv"
"TestNum,OriginalURL,Path,CrawlDate,Variant,Proto,Host,RedirectCount,RedirectHops,FinalStatus,FinalURL,CanonicalURL,Error" | Out-File -FilePath $resultsFile -Encoding UTF8

$pathLines = Get-Content -Path "D:\PROJECTS\msp-website\seo-verification\unique_paths.txt"

$variants = @(
    @{ proto = "https"; host = "nesscotech.com" },
    @{ proto = "https"; host = "www.nesscotech.com" },
    @{ proto = "http";  host = "nesscotech.com" },
    @{ proto = "http";  host = "www.nesscotech.com" }
)

$testCount = 0
$totalTests = 162 * 4

function Test-CurlUrl {
    param($url)
    # Get headers only, no redirect following
    $output = & curl.exe -s -D - -o $null --connect-timeout 8 --max-time 15 "$url" 2>&1
    if ($LASTEXITCODE -ne 0) {
        return @{ status = "ERROR"; location = $null; body = $null; error = "CURL_EXIT_$LASTEXITCODE" }
    }
    
    # Parse status code from first line
    $firstLine = ($output | Select-Object -First 1)
    $statusMatch = [regex]::Match($firstLine, 'HTTP/\d\.\d\s+(\d+)')
    $statusCode = if ($statusMatch.Success) { $statusMatch.Groups[1].Value } else { "UNKNOWN" }
    
    # Parse Location header
    $locationLine = ($output | Where-Object { $_ -match '^location:\s*' } | Select-Object -First 1)
    $location = $null
    if ($locationLine) {
        $location = ($locationLine -replace '^location:\s*','' -ireplace '\r$','').Trim()
    }
    
    return @{ status = $statusCode; location = $location; error = $null }
}

function Get-Canonical {
    param($url)
    $html = & curl.exe -s --connect-timeout 8 --max-time 15 "$url" 2>&1
    if ($LASTEXITCODE -ne 0) { return $null }
    $canonMatch = [regex]::Match($html, 'rel\s*=\s*["'']canonical["''][^>]*href\s*=\s*["'']([^"'']+)["'']')
    if ($canonMatch.Success) { return $canonMatch.Groups[1].Value }
    return $null
}

foreach ($line in $pathLines) {
    $parts = $line.Split(',', 2)
    $path = $parts[0]
    $crawlDate = $parts[1]

    foreach ($variant in $variants) {
        $testCount++
        $testUrl = "$($variant.proto)://$($variant.host)$path"
        
        $currentUrl = $testUrl
        $hops = New-Object System.Collections.Generic.List[object]
        $redirectCount = 0
        $finalStatus = $null
        $finalUrl = $null
        $errorMsg = $null
        $maxHops = 10

        for ($hop = 0; $hop -lt $maxHops; $hop++) {
            $result = Test-CurlUrl -url $currentUrl
            if ($result.error) {
                $errorMsg = $result.error
                $finalStatus = "ERROR"
                $finalUrl = $currentUrl
                break
            }
            
            $hops.Add([PSCustomObject]@{ Hop = $hop+1; URL = $currentUrl; Status = $result.status; Location = $result.location })
            
            if ($result.status -ge 300 -and $result.status -le 399 -and $result.location) {
                $redirectCount++
                if ($result.location -match '^https?://') {
                    $currentUrl = $result.location
                } elseif ($result.location -match '^/') {
                    $currentUrl = "$($variant.proto)://$($variant.host)$($result.location)"
                } else {
                    $currentUrl = $result.location
                }
            } else {
                $finalStatus = $result.status
                $finalUrl = $currentUrl
                break
            }
        }
        
        if (-not $finalStatus) {
            $errorMsg = "MAX_HOPS_EXCEEDED"
            $finalStatus = "ERROR"
            $finalUrl = $currentUrl
        }

        # Canonical extraction
        $canonicalUrl = $null
        if ($finalStatus -eq 200 -and -not $errorMsg) {
            $canonicalUrl = Get-Canonical -url $finalUrl
        }

        $hopStr = ""
        $first = $true
        foreach ($h in $hops) {
            if (-not $first) { $hopStr += " | " }
            $first = $false
            $loc = $h.Location -replace ",", ";"
            $hopStr += "$($h.Hop):$($h.Status)[$($h.URL)]->$loc"
        }

        $line = "$testCount`",""$testUrl`",""$path`",""$crawlDate`",""$($variant.proto)://$($variant.host)`",""$($variant.proto)`",""$($variant.host)`",$redirectCount`",""$hopStr`",$finalStatus`",""$finalUrl`",""$canonicalUrl`",""$errorMsg"
        $line | Out-File -FilePath $resultsFile -Append -Encoding UTF8

        if ($testCount % 20 -eq 0) {
            Write-Host "Progress: $testCount / $totalTests"
        }
    }
}

Write-Host "Verification complete. Results: $resultsFile"
