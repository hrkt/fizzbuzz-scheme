<#
Tiny Benchmark for fib(30)
#>
$sum = 0
$max = 5
for ($i = 0; $i -lt $max; $i++)
{
    $sec = Measure-Command { npm run fib30 }
    echo("$i " + $sec.TotalSeconds)
    $sum += $sec.TotalSeconds
}

echo("avg. " + ($sum / $max))
