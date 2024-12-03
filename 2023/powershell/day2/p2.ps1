param(
  [switch] $TestMode = $false
)

$fnPart = if ($TestMode) {"test"} else {"full"}
$content = Get-Content "./${fnPart}.txt"

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
        gameMin = New-Object -Type PSObject -Property @{
          red   = 0
          blue  = 0
          green = 0
        }
      }
  } | `
  ForEach-Object {
    ## calculate the min needed
    $game = $_.PSObject.Copy()

    $game.gameMin.red   = ($game.games.red   | Measure-Object -Maximum).Maximum
    $game.gameMin.green = ($game.games.green | Measure-Object -Maximum).Maximum
    $game.gameMin.blue  = ($game.games.blue  | Measure-Object -Maximum).Maximum

    return $game
  } | `
  ForEach-Object {
    ## get power and answer
    $cubePower = $_.gameMin.red * $_.gameMin.green * $_.gameMin.blue
    $answer += $cubePower
  }

Write-Host $answer
