param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test"} else {"full"}
$content = Get-Content "./_${fnPart}.txt"

$answer = 0

$content | `
  ForEach-Object {
    ## get the digits
    $pattern = "\D"
    $digits = $_ -replace $pattern, ""

    Write-Host "Found digits ${digits} ..." -NoNewline

    return $digits
  } | `
  ForEach-Object {
    ## get only the first and last digit
    $num = "$($_[0])$($_[-1])" -as [int]
    Write-Host "Found ${num} from ${_}"
    return $num
  } | `
  ForEach-Object {
    $answer += $_
  }

Write-Host $answer