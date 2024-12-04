param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test"} else {"full"}
$content = Get-Content "./data/_${fnPart}.txt"

$width = $content[0].Length
$length = $content.Length

Write-Host "Found Width: ${width}, Found Length: ${length}"
$grid = New-Object -TypeName "String[,]" -ArgumentList $width,$length
## fill out grid
for($w = 0; $w -lt $width; $w++){
  for($l = 0; $l -lt $length; $l++){
    $grid[$w,$l] = $content[$w][$l]
  }
}

## mark the where the symbols are agacent
for($w = 0; $w -lt $width; $w++){
  for($l = 0; $l -lt $length; $l++){
    $c = $grid[$w,$l]
    
    if ($c -notmatch [RegEx]"(\.|\d)"){
      $grid[$w,$l] = "${c}x"
      for($tw = $w - 1; $tw -le ($w + 1); $tw++){
        for($tl = $l - 1; $tl -le ($l + 1); $tl++){
          if (($tw -ge 0) -and ($tw -lt $width) -and ($tl -ge 0) -and ($tl -lt $length)){
            if (-not $grid[$tw,$tl].EndsWith("x")) {
              $grid[$tw,$tl]= "$($grid[$tw,$tl])x"
            }
          }
        }
      }
    }
  }
}

$numStringArray = @()
## now need to create the numbers
for($w = 0; $w -lt $width; $w++){
  $isValid = $false
  $numString = ""
  for($l = 0; $l -lt $length; $l++){
    $c = $grid[$w,$l]

    if ($c[0] -match [RegEx]"(\d)"){
      $numString += $c[0]
      if ($c[1] -eq "x"){
        $isValid = $true
      }
    } else {
      if ((($numString -ne "") -and $isValid)){
        $numStringArray += $numString
      }
      $numString = ""
      $isValid = $false
    }

    ## end of line do 
    if ($l -eq ($length - 1)){
      if ((($numString -ne "") -and $isValid)){
        $numStringArray += $numString
      }
      $numString = ""
      $isValid = $false
    }

  }
}

#print it out for testing
$log = ""
for($w = 0; $w -lt $width; $w++){
  for($l = 0; $l -lt $length; $l++){
    $formattedString = "{0,-3}" -f $grid[$w,$l]
    $log += $formattedString
  }
  $log += "`n"
}

$log | Set-Content "./logs/${fnPart}.map.log" 


$total = 0;
$log = ""
$numStringArray | ForEach-Object {
  $total += $_ -as [int]
  $log += "${_} | ${total} `n"
}

$log | Set-Content "./logs/${fnPart}.partNumbers.log" 

$total
