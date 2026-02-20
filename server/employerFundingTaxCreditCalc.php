<?php

/**
 * REF:
 * empComp: Employee compensation
 * applicablePercentage: percentage based on number of employees with anual comp greater than 5,000
 * inputA: Employer contribution level
 */

/**
 * Returns yearly employer funding tax credit (5 years out) for individual employees
 */
function individualEmployerFundingTaxCreditCalc($empComp, $applicablePercentage, $inputA) {

    if ($empComp > 100000){
        return [
            'Y1EFTC' => 0,
            'Y2EFTC' => 0,
            'Y3EFTC' => 0,
            'Y4EFTC' => 0,
            'Y5EFTC' => 0,
        ];
    }
    $prelimEFTC1and2 = $empComp* $inputA * $applicablePercentage;
    $Y1EFTC = min($prelimEFTC1and2, 1000);
    $Y2EFTC = min($prelimEFTC1and2, 1000);

    $prelimEFTC3 = .75 * ($empComp * $inputA * $applicablePercentage);
    $Y3EFTC = min($prelimEFTC3, 1000);

    $prelimEFTC4 = .5 * ($empComp * $inputA * $applicablePercentage);
    $Y4EFTC = min($prelimEFTC4, 1000);

    $prelimEFTC5 = .25 * ($empComp * $inputA* $applicablePercentage);
    $Y5EFTC = min($prelimEFTC5, 1000);


    return [
        'Y1EFTC' => floor($Y1EFTC),
        'Y2EFTC' => floor($Y2EFTC),
        'Y3EFTC' => floor($Y3EFTC),
        'Y4EFTC' => floor($Y4EFTC),
        'Y5EFTC' => floor($Y5EFTC),
    ];
}