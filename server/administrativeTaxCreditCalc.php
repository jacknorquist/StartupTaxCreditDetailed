<?php

/** REF:
 * totalEmpLessThan100: Total employees with anual comp less than $100,000
 * YR1ADM: Estimated Year One Administrative Cost (Calculated from Prelim)
 * RAAC = Estimated RecurringAnnual Administrative Cost (Calculated from Prelim)
 */

/** Takes owner earnings, year of birth (yob), and tax year.
 * Returns maximum contribution allowed for profit SEP plan.
 */
function administrativeTaxCreditCalc($totalEmpLessThan100, $YR1ADM, $RAAC) {

    $prelimAtc = min($totalEmpLessThan100 * 250, 5000);
    $Y1ATC = 0;
    $Y2ATC = 0;
    $Y3ATC = 0;
    $Y4ATC = 0;
    $Y5ATC = 0;

    if($totalEmpLessThan100 < 3){
        $Y1ATC = min(500, $YR1ADM);
    } else if($totalEmpLessThan100 > 2 && $totalEmpLessThan100 < 51){
        $Y1ATC = min($prelimAtc, $YR1ADM);
    } else if($totalEmpLessThan100 > 50) {
        $Y1ATC = min($prelimAtc, ($YR1ADM * 0.5));
    }

    if($totalEmpLessThan100 < 3){
        $Y2ATC = min(500, $RAAC);
    } else if($totalEmpLessThan100 > 2 && $totalEmpLessThan100 < 51){
        $Y2ATC = min($prelimAtc, $RAAC);
    } else if($totalEmpLessThan100 > 50){
        $Y2ATC = min($prelimAtc, ($RAAC * 0.5));
    }

    if($totalEmpLessThan100 < 3){
        $Y3ATC = min(500, $RAAC);
    } else if($totalEmpLessThan100 > 2 && $totalEmpLessThan100 < 51){
        $Y3ATC = min($prelimAtc, $RAAC);
    } else if ($totalEmpLessThan100 > 50){
        $Y3ATC = min($prelimAtc, ($RAAC * 0.5));
    }


    return [
        'Y1ATC' => floor($Y1ATC),
        'Y2ATC' => floor($Y2ATC),
        'Y3ATC' => floor($Y3ATC),
        'Y4ATC' => floor($Y4ATC),
        'Y5ATC' => floor($Y5ATC),
    ];
}
