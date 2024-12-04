param(
  [switch] $TestMode = $false
)

$global:label_x = 0
$global:label_y = 0

function Get-Label {
  $labelOptions = "abcdefghijklmnopqrstuvwxyz"

  $label = "$($labelOptions[$global:label_x])$($labelOptions[$global:label_y])"

  ## increment y
  $global:label_x++

  if ($global:label_x -gt 25){
    $global:label_x = 0
    $global:label_y++
  }

  return $label
}

$fnPart = if ($TestMode) {"test"} else {"full"}
$content = Get-Content "./data/_${fnPart}.txt"

$width = $content[0].Length
$length = $content.Length

Write-Host "Found Width: ${width}, Found Length: ${length}"
$grid = New-Object -TypeName "String[,]" -ArgumentList $width,$length
## fill out grid
for($l = 0; $l -lt $length; $l++){
  for($w = 0; $w -lt $width; $w++){
    $grid[$w,$l] = $content[$w][$l]
  }
}

## mark the where the symbols are agacent
for($l = 0; $l -lt $length; $l++){
  for($w = 0; $w -lt $width; $w++){
    $c = $grid[$w,$l]
    if ($c -eq "*"){
      $gl = Get-Label
      $grid[$w,$l] = "${c}${gl}"
      for($tl = $l - 1; $tl -le ($l + 1); $tl++){
        for($tw = $w - 1; $tw -le ($w + 1); $tw++){
          if (($tw -ge 0) -and ($tw -lt $width) -and ($tl -ge 0) -and ($tl -lt $length)){
            if ($grid[$tw,$tl] -notmatch [RegEx]"(\d\w\w)") {
              $grid[$tw,$tl]= "$($grid[$tw,$tl])${gl}"
            }
          }
        }
      }
    }
  }
}

$gears = @{}

## now need to create the numbers
for($l = 0; $l -lt $length; $l++){
  $numString = ""
  $gearLabel = ""
  for($w = 0; $w -lt $width; $w++){
    $c = $grid[$l,$w]

    if ($c -match [RegEx]"(\d)"){
      Write-Host "Found Num character ${c} " -NoNewline
      $numString += $c[0]
      if (($gearLabel -eq "") -and ($c -match [RegEx]"(\d\w\w)")){
        ## has label
        $gearLabel = $c.Substring(1)
        Write-Host "Assigned Gear Label ${gearLabel}"
      } else {
        Write-Host ""
      }
    } else {
      ## ok not a valid number
      ## lets process the numString into a gear
      ##Write-Host "End of Number Reached"
      if ($gearLabel -ne ""){
        Write-Host "==> Found Valid Gear Label ${gearLabel} for ${numString}"
        if ($null -eq $gears[$gearLabel]){
          Write-Host "====> Adding New Label '${gearLabel}' to Gears Map"
          $gears[$gearLabel] = ""
        } else {
          ## has the label already, add a "," for a seperator
          Write-Host "====> Gear Map '${gearlabel}' already exists... adding seperator"
          $gears[$gearLabel] += ","
        }

        Write-Host "==> Adding ${numString} to label ${gearLabel}"
        $gears[$gearLabel] += $numString
      }

      $numString = ""
      $gearLabel = ""
    }

    if ($w -eq ($width - 1)){
      Write-Host "End of Line Reached"
      if ($gearLabel -ne ""){
        Write-Host "==> Found Valid Gear Label ${gearLabel} for ${numString}"
        if ($null -eq $gears[$gearLabel]){
          Write-Host "====> Adding New Label '${gearLabel}' to Gears Map"
          $gears[$gearLabel] = ""
        } else {
          ## has the label already, add a "," for a seperator
          Write-Host "====> Gear Map '${gearlabel}' already exists... adding seperator"
          $gears[$gearLabel] += ","
        }

        Write-Host "==> Adding ${numString} to label ${gearLabel}"
        $gears[$gearLabel] += $numString
      }

      $numString = ""
      $gearLabel = ""
    }
  }
}

## process the gear values


#print it out for testing
$log = ""
for($w = 0; $w -lt $width; $w++){
  for($l = 0; $l -lt $length; $l++){
    $formattedString = "{0,-4}" -f $grid[$w,$l]
    $log += $formattedString
  }
  $log += "`n"
}

$log | Set-Content "./logs/p2.${fnPart}.map.log" 
$gears | Set-Content "./logs/p2.${fnPart}.gears.log"

$total = 0
$gears.Keys | ForEach-Object {
  $v = $gears[$_]
  $split = $v -split "," 

  if ($split.Length -eq 2){
    ##valid gear
    $total += $($split[0] -as [int]) * ($split[1] -as [int])
  }
}

$total

# $total = 0;
# $log = ""
# $numStringArray | ForEach-Object {
#   $total += $_ -as [int]
#   $log += "${_} | ${total} `n"
# }

# $log | Set-Content "./logs/p2.${fnPart}.partNumbers.log" 

# $total
