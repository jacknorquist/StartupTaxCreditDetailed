<?php

/** REF:
 * inputF: Include auto enrollment (boolean)
 */

function autoEnrollTaxCreditCalc($inputF) {


    $Y1AETC;
    $Y2AETC;
    $Y3AETC;
    $Y4AETC;
    $Y5AETC;

    if($inputF == "Yes"){
        $Y1AETC = 500;
        $Y2AETC = 500;
        $Y3AETC = 500;
        $Y4AETC = 0;
        $Y5AETC = 0;
    }else{
        $Y1AETC = 0;
        $Y2AETC = 0;
        $Y3AETC = 0;
        $Y4AETC = 0;
        $Y5AETC = 0;
    }


    return [
        'Y1AETC' => $Y1AETC,
        'Y2AETC' => $Y2AETC,
        'Y3AETC' => $Y3AETC,
        'Y4AETC' => $Y4AETC,
        'Y5AETC' => $Y5AETC,
    ];
}