<?php
require 'administrativeTaxCreditCalc.php';
require 'autoEnrollTaxCreditCalc.php';
require 'employerFundingTaxCreditCalc.php';


// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);


    if (json_last_error() === JSON_ERROR_NONE) {

        $empTable = is_array($data['empTable'] ?? null) ? $data['empTable'] : [];
        $inputA   = (float)($data['inputA'] ?? 0);   // already fraction (e.g. 0.05)
        $inputB   = (float)($data['inputB'] ?? 0);
        $inputC   = (float)($data['inputC'] ?? 0);
        $inputD   = (float)($data['inputD'] ?? 0);
        $inputE   = (float)($data['inputE'] ?? 0);
        $inputF = isset($data['inputF']) ? trim($data['inputF']) : 'No';
        $years = $data['years'];

        //Inital calculations used accross functions
        $totalEmpLessThan100 = count(array_filter($empTable, fn($e) => (float)($e['comp'] ?? 0) < 100000));
        $totalEmpGreaterThan5000 = count(array_filter($empTable, fn($e) => (float)($e['comp'] ?? 0) > 5000));

        $f = array_filter($empTable, fn($e) => (float)($e['comp'] ?? 0) < 100000);
        $c = count($f);

        $avgAnualCompofEmpLessThan100 = $c ? round(array_sum(array_map(fn($e) => (float)($e['comp'] ?? 0), $f)) / $c): 0;

        if ($totalEmpGreaterThan5000 < 51) {
            $applicablePercentage = 1;
        } else {
            $applicablePercentage = 1 - (($totalEmpGreaterThan5000 - 50) * 0.02);
        }

        $RAAC = ($totalEmpLessThan100 * $inputD) + $inputC + $inputE;
        $YR1ADM = $RAAC + $inputB;
        $totalCvrdComp = $totalEmpLessThan100 * $avgAnualCompofEmpLessThan100;

        //Build employer funding tax credit arrays (detailed and totals)
        $individualEmpFundingTaxCredit = [];
        $eftcTotals = ['Y1EFTC'=>0,'Y2EFTC'=>0,'Y3EFTC'=>0,'Y4EFTC'=>0,'Y5EFTC'=>0];
        foreach ($empTable as $emp) {
            $empComp = $emp['comp'];

            $eftcVals = individualEmployerFundingTaxCreditCalc(
                $empComp,
                $applicablePercentage,
                $inputA
            );

            $individualEmpFundingTaxCredit[] = array_merge([
                'firstName' => $emp['firstName'],
                'lastName'  => $emp['lastName'],
                'comp'      => $empComp
            ], $eftcVals);

            $eftcTotals['Y1EFTC'] += $eftcVals['Y1EFTC'];
            $eftcTotals['Y2EFTC'] += $eftcVals['Y2EFTC'];
            $eftcTotals['Y3EFTC'] += $eftcVals['Y3EFTC'];
            $eftcTotals['Y4EFTC'] += $eftcVals['Y4EFTC'];
            $eftcTotals['Y5EFTC'] += $eftcVals['Y5EFTC'];
        }

        $ATC = administrativeTaxCreditCalc($totalEmpLessThan100, $YR1ADM, $RAAC);
        $ATCTotal = array_sum(array_slice(array_values($ATC), 0, max(0, (int)$years)));

        $AETC = autoEnrollTaxCreditCalc($inputF);
        $AETCTotal = array_sum(array_slice(array_values($AETC), 0, max(0, (int)$years)));
        $adminTotalTaxCredits = $ATCTotal + $AETCTotal;
        $adminCost = $inputB + (($inputC + ($inputD * count($empTable)) + $inputE) * $years);
        $netAdminCost = $adminCost - $adminTotalTaxCredits;


        $employerContributions = ($totalCvrdComp * $inputA) * $years;
        $planTaxCredits = array_sum(array_slice(array_values($eftcTotals), 0, max(0, (int)$years)));
        $netFundingCost = $employerContributions - $planTaxCredits;

        $totalOutOfPocket = ($adminCost + $employerContributions) - ($adminTotalTaxCredits + $planTaxCredits);
        $totalTaxCredits = $planTaxCredits + $adminTotalTaxCredits;



        //Results
        $result = [
            'ATC'  => $ATC,
            'AETC' => $AETC,
            'EFTC' => $eftcTotals,
            'individualEmpFunding' => $individualEmpFundingTaxCredit,
            'employerPlanContributions' => $employerContributions,
            'employerFundingTaxCredits' => $planTaxCredits,
            'netFundingCost' => $netFundingCost,
            'adminCost' => $adminCost,
            'adminTaxCredits' => $adminTotalTaxCredits,
            'netAdminCost' => $netAdminCost,
            'totalOutOfPocket' => $totalOutOfPocket,
            'totalTaxCredits' => $totalTaxCredits
        ];

        // Return the result as JSON
        header('Content-Type: application/json');
        echo json_encode(['result' => $result]);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(['message' => 'Invalid JSON']);
    }
} else {
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(['message' => 'Method Not Allowed']);
}


?>
