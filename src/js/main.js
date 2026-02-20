function displayErrors(errors) {
  const errorContainer = document.getElementById('errorContainer');
  if (errors.length > 0) {
    let errorHTML = '<ul class="mb-0">';
    errors.forEach(function(error) {
      errorHTML += `<li>${error}</li>`;
    });
    errorHTML += '</ul>';
    errorContainer.innerHTML = errorHTML;
    errorContainer.classList.remove('hidden');
  } else {
    errorContainer.innerHTML = '';
    errorContainer.classList.add('hidden');
  }
}

// Validate Part B and return an array of error messages
function validatePartB() {
  const errors = [];

  // B: Anticipated initial cost for plan establishment (>= 0)
  const inputB = document.getElementById("inputB");
  const bVal = parseFloat(inputB.value);
  if (Number.isNaN(bVal) || bVal < 0) {
    errors.push("Input B: Please enter a value of 0 or greater.");
    inputB.classList.add("is-invalid");
  } else {
    inputB.classList.remove("is-invalid");
  }

  // C: Annual plan admin/recordkeeping fee (>= 0)
  const inputC = document.getElementById("inputC");
  const cVal = parseFloat(inputC.value);
  if (Number.isNaN(cVal) || cVal < 0) {
    errors.push("Input C: Please enter a value of 0 or greater.");
    inputC.classList.add("is-invalid");
  } else {
    inputC.classList.remove("is-invalid");
  }

  // D: Annual per-participant fees (>= 0)
  const inputD = document.getElementById("inputD");
  const dVal = parseFloat(inputD.value);
  if (Number.isNaN(dVal) || dVal < 0) {
    errors.push("Input D: Please enter a value of 0 or greater.");
    inputD.classList.add("is-invalid");
  } else {
    inputD.classList.remove("is-invalid");
  }

  // E: Annual enrollment/education fee (>= 0)
  const inputE = document.getElementById("inputE");
  const eVal = parseFloat(inputE.value);
  if (Number.isNaN(eVal) || eVal < 0) {
    errors.push("Input E: Please enter a value of 0 or greater.");
    inputE.classList.add("is-invalid");
  } else {
    inputE.classList.remove("is-invalid");
  }

  // F: Auto-enrollment (select Yes/No; default provided)
  const inputF = document.getElementById("inputF");
  const fVal = (inputF.value || "").trim();
  if (fVal !== "Yes" && fVal !== "No") {
    errors.push('Input F: Please select "Yes" or "No".');
    inputF.classList.add("is-invalid");
  } else {
    inputF.classList.remove("is-invalid");
  }

  return errors;
}

function backToPartB() {
  displayErrors([]);
  document.getElementById("calculations").classList.add("hidden");
  document.getElementById("actionBarCalc").classList.add("hidden");
  document.getElementById("compensationForm").classList.remove("hidden");
  document.getElementById("userInputsA").classList.add("hidden");
  document.getElementById("userInputsB").classList.remove("hidden");
  document.getElementById("actionBarA").classList.add("hidden");
  document.getElementById("actionBarB").classList.remove("hidden");
}

function nextSection() {
  const errors = [];
  if (errors.length === 0) {
    displayErrors([]);
    document.getElementById("compensationForm").classList.remove("hidden");
    document.getElementById("userInputsA").classList.add("hidden");
    document.getElementById("actionBarA").classList.add("hidden");
    document.getElementById("userInputsB").classList.remove("hidden");
    document.getElementById("actionBarB").classList.remove("hidden");
    document.getElementById("calculations").classList.add("hidden");
    document.getElementById("actionBarCalc").classList.add("hidden");
  } else {
    displayErrors(errors);
  }
}


function previousSection() {
  displayErrors([]);
  const calcVisible = !document.getElementById("calculations").classList.contains("hidden");
  if (calcVisible) {
    document.getElementById("calculations").classList.add("hidden");
    document.getElementById("actionBarCalc").classList.add("hidden");
    document.getElementById("compensationForm").classList.remove("hidden");
    document.getElementById("userInputsA").classList.add("hidden");
    document.getElementById("userInputsB").classList.remove("hidden");
    document.getElementById("actionBarA").classList.add("hidden");
    document.getElementById("actionBarB").classList.remove("hidden");
    return;
  }
  document.getElementById("userInputsB").classList.add("hidden");
  document.getElementById("actionBarB").classList.add("hidden");
  document.getElementById("userInputsA").classList.remove("hidden");
  document.getElementById("actionBarA").classList.remove("hidden");
}


function submitForm() {
  const errors = validatePartB();
 if (errors.length === 0) {
    displayErrors([]);
    document.getElementById("compensationForm").classList.add("hidden");
    document.getElementById("userInputsB").classList.add("hidden");
    document.getElementById("actionBarB").classList.add("hidden");
    document.getElementById("calculations").classList.remove("hidden");
    document.getElementById("actionBarCalc").classList.remove("hidden");
    document.getElementById("loadingSpinner").classList.remove("hidden");
  } else {
    displayErrors(errors);
    return;
  }
  const inputA = document.getElementById("inputA").value.trim();
  const inputB = document.getElementById("inputB").value.trim();
  const inputC = document.getElementById("inputC").value.trim();
  const inputD = document.getElementById("inputD").value.trim();
  const inputE = document.getElementById("inputE").value.trim();
  const inputF = document.getElementById("inputF").value.trim();
  const years = document.getElementById("time_frame").value.trim();

  const empTable = []
  const tbody = document.querySelector('#empTableInputs')
  tbody.querySelectorAll('tr.emp-row').forEach(row=>{
    empTable.push({
      firstName: row.querySelector('td.first-name').textContent,
      lastName: row.querySelector('td.last-name').textContent,
      comp: parseFloat(row.querySelector('td.comp').textContent)
    })
  })

  const payload = {
    empTable: empTable,
    inputA: parseFloat(inputA)/100,
    inputB: parseFloat(inputB),
    inputC: parseFloat(inputC),
    inputD: parseFloat(inputD),
    inputE: parseFloat(inputE),
    inputF: inputF,
    years:  parseFloat(years)
  };

  // Prepare JSON payload
  const jsonPayload = JSON.stringify(payload);
  // Send JSON data to API
  fetch(  "./backend/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonPayload
  })
    .then(response => response.json())
    .then(data => {
      setTimeout(function() {
        document.getElementById("loadingSpinner").classList.add("hidden");
        showResults(data.result);
      }, 1500);
    })
    .catch(error => {
      document.getElementById("loadingSpinner").classList.add("hidden");
      alert("There was an error submitting the form.");
    });
}

function showResults(results){
  const money = v => {
    v = +v || 0;
    return (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString();
  };

  const credit = v => "-$" + Math.abs(+v || 0).toLocaleString();

  document.getElementById("totalTaxCredits").textContent =
    money(results.totalTaxCredits);

  document.getElementById("employerPlanContributions-1").textContent =
    money(results.employerPlanContributions);

  document.getElementById("employerPlanContributions-2").textContent =
    money(results.employerPlanContributions);

  document.getElementById("employerFundingTaxCredits").textContent =
    credit(results.employerFundingTaxCredits);

  document.getElementById("netFundingCost").textContent =
    money(results.netFundingCost);

  document.getElementById("adminCost").textContent =
    money(results.adminCost);

  document.getElementById("adminTaxCredits").textContent =
    credit(results.adminTaxCredits);

  document.getElementById("netAdminCost").textContent =
    money(results.netAdminCost);

  document.getElementById("totalOutOfPocket-1").textContent =
    money(results.totalOutOfPocket);

  document.getElementById("totalOutOfPocket-2").textContent =
    money(results.totalOutOfPocket);
}




function setupEmployeeTable(){
  const tbody=document.querySelector('#employeesTable tbody')
  const [firstInp,lastInp,compInp]=['firstName','lastName','comp'].map(id=>document.getElementById(id))
  document.getElementById('btnAdd').addEventListener('click',()=>{
    if([firstInp,lastInp,compInp].some(i=>!i.value.trim()))return
    const row=document.createElement('tr');
    row.classList.add('emp-row');
    ;[firstInp,lastInp,compInp].forEach((i,idx)=>{
      const td=document.createElement('td')
      td.classList.add(['first-name','last-name','comp'][idx])
      td.textContent=i.value.trim()
      row.appendChild(td)
      i.value=''
    })
    const delCell=document.createElement('td')
    const delBtn=document.createElement('button')
    delBtn.type='button'
    delBtn.className='btn btn-link p-0 text-danger'
    delBtn.textContent='Delete'
    delBtn.setAttribute('aria-label','Remove '+row.children[0].textContent+' '+row.children[1].textContent)
    delCell.appendChild(delBtn)
    row.appendChild(delCell)
    tbody.appendChild(row)
  })
  tbody.addEventListener('click',e=>{
    if(e.target.closest('button'))e.target.closest('tr').remove()
  })
}
document.addEventListener('DOMContentLoaded',setupEmployeeTable)

 $(function() {
          // Plus/minus buttons for contribution percentage
          $('#contrib_plus').on('click', function() {
            const $input = $('#inputA');
            let val = parseInt($input.val()) || 3;
            if (val < 25) {
              $input.val(val + 1).trigger('change');
            }
            // ONLY submit if we're already on the calculations page
            if (!document.getElementById("calculations").classList.contains("hidden")) {
              submitForm();
            }
          });

          $('#contrib_minus').on('click', function() {
            const $input = $('#inputA');
            let val = parseInt($input.val()) || 3;
            if (val > 1) {
              $input.val(val - 1).trigger('change');
            }
            // ONLY submit if we're already on the calculations page
            if (!document.getElementById("calculations").classList.contains("hidden")) {
              submitForm();
            }
          });

          // Update slider display and position
          function updateSliderDisplay() {
            const $slider = $('#time_frame');
            const $display = $('#time_frame_display');
            const val = $slider.val();
            const min = $slider.attr('min');
            const max = $slider.attr('max');

            // Update display text
            $display.text(val);

            // Calculate position (0% to 100%)
            const percent = ((val - min) / (max - min)) * 100;

            // Position the display bubble above the thumb
            $display.css('left', `calc(${percent}% + ${10 - percent * 0.2}px)`);

            // ONLY submit if we're already on the calculations page
            if (!document.getElementById("calculations").classList.contains("hidden")) {
              submitForm();
            }
          }

          $('#time_frame').on('input change', updateSliderDisplay);

          // Initialize (but don't submit)
          updateSliderDisplay();
  });


 (function() {
      // Clear browser navigation cache
      if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
      }

      // Force reset to first page
      function resetToFirstPage() {
        // Hide all sections first
        document.getElementById('userInputsA').classList.add('hidden');
        document.getElementById('userInputsB').classList.add('hidden');
        document.getElementById('calculations').classList.add('hidden');
        document.getElementById('actionBarA').classList.add('hidden');
        document.getElementById('actionBarB').classList.add('hidden');
        document.getElementById('actionBarCalc').classList.add('hidden');
        document.getElementById('compensationForm').classList.add('hidden');

        // Then show only first page elements
        document.getElementById('userInputsA').classList.remove('hidden');
        document.getElementById('actionBarA').classList.remove('hidden');
        document.getElementById('compensationForm').classList.remove('hidden');

        // Clear any error/loading states
        document.getElementById('errorContainer').classList.add('hidden');
        document.getElementById('loadingSpinner').classList.add('hidden');
      }

      // Run on DOMContentLoaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resetToFirstPage);
      } else {
        resetToFirstPage();
      }

      // Also run on page show (handles back/forward navigation)
      window.addEventListener('pageshow', function(event) {
        resetToFirstPage();
      });
    })();