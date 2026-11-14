# SEO Production Redirect Verification - SIMPLE & FAST
# Tests 162 unique paths x 4 variants = 648 test cases
# No canonical extraction in main loop (done separately if needed)
# 5-second timeouts, incremental CSV output

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
            $resp = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
            $finalStatus = $resp.StatusCode
            $finalUrl = $resp.ResponseUri.ToString()

            if ($finalStatus -eq 200) {
                $canonMatch = [regex]::Match($resp.Content, 'rel\s*=\s*["'']canonical["''][^>]+href\s*=\s*["'']([^"'']+)["'']')
                if ($canonMatch.Success) { $canonicalUrl = $canonMatch.Groups[1].Value }
            }

            $hopStr = "1:$finalStatus[$testUrl]->$finalUrl"
            $redirectCount = 0

            if ($finalStatus -match "^3") {
                # Trace redirect chain
                $currentUrl = $testUrl
                $hops = New-Object System.Collections.Generic.List[object]
                $redirectCount = 0
                for ($hop = 0; $hop -lt 10; $hop++) {
                    try {
                        $r = Invoke-WebRequest -Uri $currentUrl -Method GET -MaximumRedirection 0 -TimeoutSec 5 -ErrorAction Stop
                        $sc = $r.StatusCode
                        $loc = $r.Headers["Location"]
                        $hops.Add([PSCustomObject]@{ Hop = $hop+1; URL = $currentUrl; Status = $sc; Location = $loc })
                        if ($sc -ge 300 -and $sc -le 399 -and $loc) {
                            $redirectCount++
                            if ($loc -match '^https?://') { $currentUrl = $loc }
                            elseif ($loc -match '^/') {
                                $uri = [Uri]$currentUrl
                                $currentUrl = "$($uri.Scheme)://$($uri.Host)$loc"
                            } else { $currentUrl = $loc }
                        } else {
                            $finalStatus = $sc
                            $finalUrl = $currentUrl
                            break
                        }
                    }
                    catch { $errorMsg = $_.Exception.Message; $finalStatus = "ERROR"; $finalUrl = $currentUrl; break }
                }
                $hopStr = ""
                $first = $true
                foreach ($h in $hops) {
                    if (-not $first) { $hopStr += " | " }
                    $first = $false
                    $loc = $h.Location -replace ",", ";"
                    $hopStr += "$($h.Hop):$($h.Status)[$($h.URL)]->$loc"
                }
            }
        }
        catch {
            $finalStatus = "ERROR"
            $finalUrl = $testUrl
            $hopStr = "1:ERROR[$testUrl]->"
            $redirectCount = 0
        }

        $line = "$testCount`",""$testUrl`",""$path`",""$crawlDate`",""$($variant.proto)://$($variant.host)`",""$($variant.proto)`",""$($variant.host)`",$redirectCount`",""$hopStr`",$finalStatus`",""$finalUrl`",""$canonicalUrl`",""$errorMsg"
        $line | Out-File -FilePath $resultsFile -Append -Encoding UTF8

        if ($testCount % 20 -eq 0) {
            Write-Host "Progress: $testCount / $totalTests"
        }
    }
}

Write-Host "Verification complete. Results: $resultsFile"
