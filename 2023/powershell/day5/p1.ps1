function Find-InMap{
    param(
        $Map,
        [int64]$Source
    )

    $result = $Source

    for ($i = 0; $i -lt $Map.Count; $i++){
        $sourceStart, $destStart, $range = $Map[$i]       
        if (($Source -ge $sourceStart) -and ($Source -lt ($sourceStart + $range))){
            ## ok its here, find the difference between source start and actual source
            $diff = $Source - $sourceStart
            $result = $destStart + $diff
            break
        }
    }

    return $result
}

$fn = "./data/full.txt"
$almanac = Get-Content $fn
$currentMapLabel = ""
$seeds = @{}
$map = @{}

$almanac | ForEach-Object {
    switch($_.ToString().Trim()){
        { $_.StartsWith("seeds:") } 
            {
                ## process seeds map
                $currentMapLabel = "SEEDS"
                Write-Host "Found Seeds"

                $_.Split(":")[1].Trim().Split(" ") | `
                    ForEach-Object {
                        $baseObj = @{
                            soil     = [int64]0
                            fertizer = [int64]0
                            water    = [int64]0
                            light    = [int64]0
                            temp     = [int64]0
                            humidity = [int64]0
                            location = [int64]0
                    
                        }
                        $seeds.Add($_ , $baseObj.PsObject.Copy())
                    }

                break
            }
        { $_.EndsWith(":")} 
            {
                $currentMapLabel = $_
                Write-Host "Found new Map ${_}"
                break
            }
        { $_ -eq ""}
            {
                Write-Host "empty string... not to be processed"
                break
            }
        default
            {
                Write-Host "Processing ${_} for Map ${currentMapLabel}"
                $split       = $_ -split " "
                $destStart   = $split[0] -as [int64]
                $sourceStart = $split[1] -as [int64]
                $range       = $split[2] -as [int64]

                if ($map[$currentMapLabel] -eq $null){
                    $map[$currentMapLabel] = @()
                }

                $map[$currentMapLabel] += , @($sourceStart, $destStart, $range)
            }
    }
}

## get the lowest location
$location = [int]::MaxValue

## generate seed map
$seeds.Keys | `
    ForEach-Object {
        $seed          = $seeds[$_]
        $seed.soil     = Find-InMap -Map $map["seed-to-soil map:"]              -Source $_
        $seed.fertizer = Find-InMap -Map $map["soil-to-fertilizer map:"]        -Source $seed.soil
        $seed.water    = Find-InMap -Map $map["fertilizer-to-water map:"]       -Source $seed.fertizer
        $seed.light    = Find-InMap -Map $map["water-to-light map:"]            -Source $seed.water
        $seed.temp     = Find-InMap -Map $map["light-to-temperature map:"]      -Source $seed.light
        $seed.humidity = Find-InMap -Map $map["temperature-to-humidity map:"]   -Source $seed.temp
        $seed.location = Find-InMap -Map $map["humidity-to-location map:"]      -Source $seed.humidity

        if ($seed.location -lt $location){
            Write-Host "Location $($seed.location) is closer than ${location}"
            $location = $seed.location
        }
    }

$location