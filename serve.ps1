# Serves this folder on http://localhost:5190 the way Webflow serves the published site:
# - clean URLs: /services/heritage-design -> services/heritage-design.html, /path/ -> 301 /path
# - includes: <!--#include file="/global/partials/footer.html" --> is replaced by that file;
#   extra attributes are parameters, used in the file as {{name}}, {{#name}}...{{/name}} (kept only when set)
#   and {{^name}}...{{/name}} (kept only when not set)
# - current page: links to the requested page get class w--current and aria-current="page", as Webflow adds them
# - pages: only the six service pages and the Service Pages overview (/services, dev/service-overview.html) are served;
#   every other page address returns the shared placeholder (dev/placeholder.html). Assets (CSS, JS, images, fonts)
#   are served as files. -AllPages serves every HTML file instead (used for the reference copy on port 5191).
param(
  [string]$Root = $PSScriptRoot,
  [int]$Port = 5190,
  [switch]$AllPages
)

$servicePages = @('rural-conversions', 'heritage-design', 'luxury-architecture', 'planning-applications', '3d-visualisations', 'project-management')

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="application/javascript; charset=utf-8"; ".mjs"="application/javascript";
  ".json"="application/json"; ".svg"="image/svg+xml"; ".png"="image/png"; ".avif"="image/avif"; ".md"="text/plain; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".webp"="image/webp"; ".ico"="image/x-icon";
  ".woff"="font/woff"; ".woff2"="font/woff2";
}
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Expand-Includes([string]$html, [hashtable]$params, [int]$depth) {
  if ($depth -gt 8) { throw "Includes nested too deeply" }
  if ($params) {
    $html = [regex]::Replace($html, '\{\{#([\w-]+)\}\}([\s\S]*?)\{\{/\1\}\}', [System.Text.RegularExpressions.MatchEvaluator]{
      param($m) if ($params[$m.Groups[1].Value]) { $m.Groups[2].Value } else { '' } })
    $html = [regex]::Replace($html, '\{\{\^([\w-]+)\}\}([\s\S]*?)\{\{/\1\}\}', [System.Text.RegularExpressions.MatchEvaluator]{
      param($m) if ($params[$m.Groups[1].Value]) { '' } else { $m.Groups[2].Value } })
    $html = [regex]::Replace($html, '\{\{([\w-]+)\}\}', [System.Text.RegularExpressions.MatchEvaluator]{
      param($m) [string]$params[$m.Groups[1].Value] })
  }
  return [regex]::Replace($html, '<!--#include\s+file="([^"]+)"((?:\s+[\w-]+="[^"]*")*)\s*-->', [System.Text.RegularExpressions.MatchEvaluator]{
    param($m)
    $file = Join-Path $Root ($m.Groups[1].Value.TrimStart('/') -replace '/', '\')
    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { return "<!-- include not found: $($m.Groups[1].Value) -->" }
    $p = @{}
    foreach ($a in [regex]::Matches($m.Groups[2].Value, '([\w-]+)="([^"]*)"')) { $p[$a.Groups[1].Value] = [System.Net.WebUtility]::HtmlDecode($a.Groups[2].Value) }
    $content = [System.IO.File]::ReadAllText($file, $utf8)
    Expand-Includes $content $p ($depth + 1)
  })
}

function Set-CurrentLinks([string]$html, [string]$path) {
  $escaped = [regex]::Escape($path)
  return [regex]::Replace($html, "<a\b[^>]*\bhref=""$escaped""[^>]*>", [System.Text.RegularExpressions.MatchEvaluator]{
    param($m)
    $tag = $m.Value
    if ($tag -match 'w--current') { return $tag }
    if ($tag -match ' class="') { $tag = $tag -replace ' class="([^"]*)"', ' aria-current="page" class="$1 w--current"' }
    else { $tag = $tag -replace '>$', ' aria-current="page" class="w--current">' }
    return $tag
  })
}

function Send($res, [int]$status, [string]$type, [byte[]]$bytes) {
  $res.StatusCode = $status
  $res.ContentType = $type
  $res.Headers.Add("Cache-Control", "no-store")
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path.Length -gt 1 -and $path.EndsWith("/")) {
      $res.StatusCode = 301
      $res.RedirectLocation = $path.TrimEnd("/") + $req.Url.Query
      continue
    }
    $rel = $path.Trim("/") -replace "/", "\"
    $full = if ($rel -eq "") { Join-Path $Root "index.html" } else { Join-Path $Root $rel }
    if (-not [System.IO.Path]::GetExtension($full) -and (Test-Path -LiteralPath "$full.html" -PathType Leaf)) {
      $full = "$full.html"
    }
    if (-not $AllPages) {
      # Page addresses (no extension, or .html): the six service pages, the overview, else the placeholder.
      $ext0 = [System.IO.Path]::GetExtension($path).ToLower()
      if ($ext0 -eq "" -or $ext0 -eq ".html") {
        $page = $path.Trim("/") -replace '\.html$', ''
        if ($page -eq "services") { $full = Join-Path $Root "dev\service-overview.html" }
        elseif ($page -match '^services/([\w-]+)$' -and $servicePages -contains $Matches[1]) { $full = Join-Path $Root "services\$($Matches[1]).html" }
        else { $full = Join-Path $Root "dev\placeholder.html" }
      }
    }
    $inside = [System.IO.Path]::GetFullPath($full).StartsWith([System.IO.Path]::GetFullPath($Root))
    if ($inside -and (Test-Path -LiteralPath $full -PathType Leaf)) {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ct = $mime[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      if ($ext -eq ".html") {
        $html = Expand-Includes ([System.IO.File]::ReadAllText($full, $utf8)) $null 0
        $html = Set-CurrentLinks $html $path
        Send $res 200 $ct ($utf8.GetBytes($html))
      } else {
        Send $res 200 $ct ([System.IO.File]::ReadAllBytes($full))
      }
    } else {
      Send $res 404 "text/plain; charset=utf-8" ($utf8.GetBytes("404"))
    }
  } catch {
    try { Send $res 500 "text/plain; charset=utf-8" ($utf8.GetBytes("500: $($_.Exception.Message)")) } catch {}
  } finally {
    $res.OutputStream.Close()
  }
}
