param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test2"} else {"full"}
$content = Get-Content "./data/day1-${fnPart}.txt"
$replaceArray = [ordered]@{
  "one"   = "o1e"
  "two"   = "t2o"
  "three" = "t3e"
  "four"  = "f4r"
  "five"  = "f5e"
  "six"   = "s6x"
  "seven" = "s7n"
  "eight" = "e8t"
  "nine"  = "n9e"
}
$match = "(one|two|three|four|five|six|seven|eight|nine)"

$answer = 0
$processCounter = 0

$content | `
  ForEach-Object {
    ## update item counter
    $processCounter++
    return $_
  } | `
  ForEach-Object {
    ## convert spelled out digits to numbers in the string
    Write-Host "[${processCounter}] Correcting String Values for ${_}"
    $newValue = $_
    while($newValue -match $match) {
      $key = $Matches[0]
      $value = $replaceArray[$key]

      $newValue = ([RegEx]$key).Replace($newValue, $value, 1)

      Write-Host "===> ${newValue}"
    }    
    return $newValue
  } | `
  ForEach-Object {
    ## get the digits
    Write-Host "Getting Digits for ${_}"
    $pattern = "\D"
    $digits = $_ -replace $pattern, ""

    Write-Host "===> Found digits ${digits}"

    return $digits
  } | `
  ForEach-Object {
    ## get only the first and last digit
    Write-Host "Getting First and Last digit from ${_}"
    $num = "$($_[0])$($_[-1])" -as [int]
    Write-Host "===> Found ${num} from ${_}"
    return $num
  } | `
  ForEach-Object {
    $answer += $_
    Write-Host "Running total: ${answer}"
    Write-Host "------------------------"
  }

Write-Host $answer