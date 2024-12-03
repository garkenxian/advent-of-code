param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test"} else {"full"}
$content = Get-Content "./${fnPart}.txt"

<#
  determine if the game was possible if there was only 
  12 red, 13 green, and 14 blue cubes
#>

$gameLimit = New-Object -Type PSObject -Property @{
  red   = 12
  blue  = 14
  green = 13
}

$answer = 0

$content | `
  ForEach-Object {
    ## break string into object
  
    $_parts = ($_ -split ":")
    
    $gameId = $_parts[0].SubString(5)
    Write-Host "Game Id: ${gameId}"

    $games = ($_parts[1] -split ";") | `
      ForEach-Object {
        $game = New-Object -Type PSObject -Property @{
          red   = 0
          blue  = 0
          green = 0
        }

        Write-Host $_

        $_ -split "," | `
          ForEach-Object {
            $g = $_.Trim() -split " "
            $game."$($g[1])" = ($g[0] -as [int])
          }

          return $game
      }

      return New-Object -Type PSObject -Property @{
        gameId = $gameId
        games = $games
      }
  } | `
  Where-Object {
    $isValid = $true

    for ($i = 0; $i -le $_.games.Length; $i++){
      if (($_.games[$i].red -gt $gameLimit.red) -or ($_.games[$i].green -gt $gameLimit.green) -or ($_.games[$i].blue -gt $gameLimit.blue)){
        $isValid = $false
        break;
      }
    }

    Write-Host $(if ($isValid) {"VALID"} else {"NOT VALID"})

    return $isValid

  } | `
  ForEach-Object {
    $answer += ($_.gameId -as [int])
  }

Write-Host $answer
