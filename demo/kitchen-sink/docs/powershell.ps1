# This is a simple comment
function Hello($name) {
  Write-host "Hello $name"
}

function add($left, $right=4) {
    if ($right -ne 4) {
        return $left
    } elseif ($left -eq $null -and $right -eq 2) {
        return 3
    } else {
        return 2
    }
}

$number = 1 + 2;
$number += 3

Write-Host Hello -name "World"

$an_array = @(1, 2, 3)
$a_hash = @{"something" = "something else"}

& notepad .\readme.md

$h1 = @{ FirstName = "James"; LastName = "Anderson"; IDNum = 123 }
$last = "Anderson"; $IDNum = 120
$h2 = @{ FirstName = "James"; LastName = $last; IDNum = $IDNum + 3 }
$h3 = @{ }
$h4 = @{ 10 = "James"; 20.5 = "Anderson"; $true = 123 }

${Maximum_Count_26}
${Name with`twhite space and `{punctuation`}}
${E:\\File.txt}

"C:\Temp\" {mkdir "C:\Temp\"}
"C:\Temp\"

@"
This is a here string
$h1 = @{ FirstName = "James"; LastName = "Anderson"; IDNum = 123 }
$last = "Anderson"; $IDNum = 120
$h2 = @{ FirstName = "James"; LastName = $last; IDNum = $IDNum + 3 }
$h3 = @{ }
$h4 = @{ 10 = "James"; 20.5 = "Anderson"; $true = 123 }
$j = 20

still string
$($i = 10) # pipeline gets nothing
$(($i = 10)) # pipeline gets int 10
$($i = 10; $j) # pipeline gets int 20
$(($i = 10); $j) # pipeline gets [object[]](10,20)
$(($i = 10); ++$j) # pipeline gets int 10
$(($i = 10); (++$j)) # pipeline gets [object[]](10,22)
$($i = 10; ++$j) # pipeline gets nothing
$(2,4,6) # pipeline gets [object[]](2,4,6)
"@

@'
Expressions inside should be recognised as string
$h1 = @{ FirstName = "James"; LastName = "Anderson"; IDNum = 123 }
$last = "Anderson"; $IDNum = 120
$h2 = @{ FirstName = "James"; LastName = $last; IDNum = $IDNum + 3 }
$h3 = @{ }
$h4 = @{ 10 = "James"; 20.5 = "Anderson"; $true = 123 }
'@
