$testMode = $false
$fn = "./data/$(if ($testMode) { "test" } else { "full" }).txt"
$logFn = "./logs/$(if ($testMode) { "test" } else { "full" }).log"

$data = Get-Content $fn

function Log-Game {
    param(
        [string] $logFile,
        [PsObject] $game
    )

@"
$($game.original)
  Matches : $($game.matches)
  Score   : $($game.score)
==================================
"@ | Add-Content $logFile

}

function Get-GameId {
    param(
        [string] $game
    )

    return ($game -split ":")[0].Substring(4).Trim() -as [int]
}

function Get-WinningNumbers {
    param(
        [string] $game
    )

    return $game.Split(":")[1].Split("|")[0].Trim().Split(" ") | `
    Where-Object {
        $_.Trim() -ne ""
    } | `
    ForEach-Object {
        return $_.Trim() -as [int]
    } 
}

function Get-LotteryNumbers {
    param(
        [string] $game
    )

    return $game.Split(":")[1].Split("|")[1].Trim().Split(" ") | `
        Where-Object {
            $_.Trim() -ne ""
        } | `
        ForEach-Object {
            return $_.Trim() -as [int]
        } 
}

function Get-Matches{
    param(
        [PsObject]$game
    )

    $_matches = @()

    $game.numbers | `
        ForEach-Object {
            if ($game.winning_numbers -contains $_){
                $_matches += $_
            }
        }

    return $_matches
}

$total = 0

$data | `
    ForEach-Object {
        ## create game object
        $game = @{
            original        = $_
            card_number     = Get-GameId $_
            winning_numbers = Get-WinningNumbers $_
            numbers         = Get-LotteryNumbers $_
            matches         = @()
            score           = 0
        }

        return $game
    } | `
    ForEach-Object {
        #calculate matches
        $game = $_
        $game.matches = @(Get-Matches $game)
        return $game
    } | `
    ForEach-Object {
        ## determine game store
        $game = $_
        $numOfMatches = $game.matches.Count

        if ($numOfMatches -gt 0) {
            $game.score = [Math]::Pow(2, $game.matches.Count - 1)
        }

        return $game
    } | `
    ForEach-Object {
        ## now add the score to the total
        $total += $game.score
        return $game
    } | `
    ForEach-Object {
        Log-Game -logFile $logFn -game $_
        return $game
    }

$total