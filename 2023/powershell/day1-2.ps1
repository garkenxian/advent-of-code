param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test2"} else {"full"}
$content = Get-Content "./data/day1-${fnPart}.txt"
<# 

  got hint from here https://www.reddit.com/r/adventofcode/comments/1888qih/2023_day_1_help_pls/

  had to get help on this one, apparently when replacing you have to account 
  for eighthree being both 8 and 3, initially i was replacing "eight" with 8 and 
  then it would be 8hree and not replace the 3.  At first i thought that was the point
  but guess not.  The description was not very clear on this however.

  I blame the product manager ;)

  So instead of replacing "one" with "1", it replaces "one" with "o1e" and keeps the 
  last letter overlap intact

  so in the case of "eighthree" it replaces eight with "e8t" making the string to be 
  "e8three" and then replaces "three" with "t3e" so final string is "e8t3e"

  in the example of "eighthreeight" the final will be "e8t3e8t" and finally filtered to 838 then 88

  Good luck

#>
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