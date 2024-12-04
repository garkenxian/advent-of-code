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

## convert into a dictonary for games
$games = @{}

$data | `
    ForEach-Object {
        ## create game object
        $game = @{
            original        = $_
            card_number     = Get-GameId $_
            winning_numbers = Get-WinningNumbers $_
            numbers         = Get-LotteryNumbers $_
            matches         = @()
            copies          = 1
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
        ## add to dictionary
        $games.Add($_.card_number, $_)
    }

for($i = 1; $i -le $games.Keys.Count; $i++){
    $game = $games[$i]
    $gameMatches = $game.matches.Count

    for($m = 1; $m -le $gameMatches; $m++){
        $updatedGameId = $i + $m
        $games[$updatedGameId].copies = $games[$updatedGameId].copies + $game.copies
    } 
}

$total = 0

## get the total number of cards
$games.Keys | `
    ForEach-Object {
        $game = $games[$_]
        $total += $game.copies
    }

$games
$total
