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
  } else {
    displayErrors(errors);
  }
}


function previousSection() {
  displayErrors([]);
  const calcVisible = !document.getElementById("calculations").classList.contains("hidden");
  if (calcVisible) {
    document.getElementById("calculations").classList.add("hidden");
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
    document.getElementById("loadingSpinner").classList.remove("hidden");
  } else {
    displayErrors(errors);
    return;
  }
  const inputA = document.getElementById("contrib-slider").value.trim();
  const inputB = document.getElementById("inputB").value.trim();
  const inputC = document.getElementById("inputC").value.trim();
  const inputD = document.getElementById("inputD").value.trim();
  const inputE = document.getElementById("inputE").value.trim();
  const inputF = document.getElementById("inputF").value.trim();
  const years = document.getElementById("years-slider").value.trim();

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
  fetch(  "./server/api.php", {
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

let serverResult = null;
function showResults(result) {
  serverResult = result;
  render();
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

    /* ── Helpers ── */
const fmt = v => '$' + Math.abs(Math.round(v)).toLocaleString();
const el  = id => document.getElementById(id);
const show = id => el(id).classList.remove('d-none');
const hide = id => el(id).classList.add('d-none');

/* ================================================================
   PLAN INPUTS
   These values come from your calculation engine.
   Replace with dynamic values from your backend/engine as needed.
   ================================================================ */
const PLAN = {
  employees:     5,
  avgSalary:     50000,
  establishCost: 1500,
  annualAdmin:   1500,
  perParticipant:50,
  enrollFee:     0,
  autoEnroll:    true,
};

/* Funding credit phase-down per SECURE 2.0 (Year 1–5) */
const FUNDING_PHASE = [1.0, 1.0, 0.75, 0.50, 0.25];

/* ── State ── */
let currentView  = 'advisor';
let revealStep   = { admin: 0, funding: 0 };

/* ── Calculate credits & totals ── */
function buildTFromServer() {
  const r    = serverResult;
  const years = Number(el('years-slider').value);

  const inputB        = parseFloat(document.getElementById('inputB').value) || 0;
  const inputC        = parseFloat(document.getElementById('inputC').value) || 0;
  const inputD        = parseFloat(document.getElementById('inputD').value) || 0;
  const inputE        = parseFloat(document.getElementById('inputE').value) || 0;
  const autoEnroll    = document.getElementById('inputF').value.trim() === 'Yes';
  const empRows       = document.querySelectorAll('#empTableInputs tr.emp-row');
  const employees     = empRows.length || 1;
  const comps         = [...empRows].map(row => parseFloat(row.querySelector('td.comp').textContent) || 0);
  const avgSalary     = comps.length ? comps.reduce((s, v) => s + v, 0) / comps.length : 0;
  const recurringAdmin = inputC + (inputD * employees) + inputE;
  const annualFund    = r.employerPlanContributions / years;

  const rows = Array.from({ length: years }, (_, i) => {
    const yr         = i + 1;
    const grossAdmin = yr === 1 ? inputB + recurringAdmin : recurringAdmin;
    const grossFund  = annualFund;
    const startupCr  = r.ATC['Y'  + yr + 'ATC']  || 0;
    const autoEnrCr  = r.AETC['Y' + yr + 'AETC'] || 0;
    const fundingCr  = r.EFTC['Y' + yr + 'EFTC'] || 0;
    const totalAdmCr = startupCr + autoEnrCr;
    return {
      yr, grossAdmin, grossFund,
      startupCr, autoEnrCr, fundingCr, totalAdmCr,
      netAdmin:        grossAdmin - totalAdmCr,
      netFund:         grossFund  - fundingCr,
      employeeBenefit: grossFund,
    };
  });

  const ATCTotal  = Object.entries(r.ATC).slice(0, years).reduce((s, [, v]) => s + v, 0);
  const AETCTotal = Object.entries(r.AETC).slice(0, years).reduce((s, [, v]) => s + v, 0);

  return {
    // Server aggregates
    grossAdmin:   r.adminCost,
    grossFund:    r.employerPlanContributions,
    startupCr:    ATCTotal,
    autoEnrCr:    AETCTotal,
    fundingCr:    r.employerFundingTaxCredits,
    totalAdmCr:   r.adminTaxCredits,
    netAdmin:     r.netAdminCost,
    netFund:      r.netFundingCost,
    employeeBen:  r.employerPlanContributions,
    totalCredits: r.totalTaxCredits,
    totalOOP:     r.totalOutOfPocket,
    // Needed for render() display/tooltips
    employees,
    autoEnroll,
    avgSalary,
    establishCost:  inputB,
    annualAdmin:    inputC,
    perParticipant: inputD,
    enrollFee:      inputE,
    rows,
  };
}

/* ── Main render ── */
function render() {
  if (!serverResult) return;

  const T      = buildTFromServer();
  const contrib = Number(el('contrib-slider').value);
  const years   = Number(el('years-slider').value);
  const { employees, autoEnroll,
          establishCost, annualAdmin, perParticipant, enrollFee, avgSalary } = T;

  /* Slider displays */
  el('contrib-display').textContent = contrib + '%';
  el('years-display').textContent   = years + ' yr' + (years > 1 ? 's' : '');

  /* Header */
  el('hdr-total-credits').textContent = fmt(T.totalCredits);
  el('hdr-subtitle').textContent = `Based on ${employees} employees · ${years}-year projection · ${contrib}% contribution rate`;

  /* ── Results page – Advisor ── */
  el('adv-gross-contrib').textContent     = fmt(T.grossFund);
  el('adv-funding-credit').textContent    = '-' + fmt(T.fundingCr);
  el('adv-net-funding').textContent       = fmt(T.netFund);
  el('adv-gross-admin').textContent       = fmt(T.grossAdmin);
  el('adv-startup-credit').textContent    = '-' + fmt(T.startupCr);
  el('adv-autoenroll-credit').textContent = '-' + fmt(T.autoEnrCr);
  el('adv-autoenroll-row').style.display  = (autoEnroll && T.autoEnrCr > 0) ? '' : 'none';
  el('adv-net-admin').textContent         = fmt(T.netAdmin);
  el('adv-total-oop').textContent         = fmt(T.totalOOP);

  /* ── Results page – Client ── */
  el('own-gross-contrib').textContent = fmt(T.grossFund);
  el('own-total-credits').textContent = '-' + fmt(T.totalCredits);
  el('own-total-oop').textContent     = fmt(T.totalOOP);

  /* ── Callout ── */
  el('callout-text').innerHTML =
    `<strong>Cost/Benefit:</strong> For <strong>${fmt(T.totalOOP)}</strong> out of pocket over ${years} year${years>1?'s':''}, ` +
    `you provide <strong>${fmt(T.grossFund)}</strong> in retirement benefits to your ${employees} employees — ` +
    `and receive <strong>${fmt(T.totalCredits)}</strong> back in tax credits.`;

  /* ── Admin Panel ── */
  el('admin-panel-subtitle').textContent  = `${years}-year projection · ${employees} employees`;
  el('eq-admin-gross').textContent        = fmt(T.grossAdmin);
  el('eq-admin-credit').textContent       = fmt(T.totalAdmCr);
  el('eq-admin-net').textContent          = fmt(T.netAdmin);
  el('det-establish').textContent         = fmt(establishCost);
  el('det-annual-admin').textContent      = fmt(annualAdmin * years);
  el('tip-annual-admin').textContent      = `$${annualAdmin.toLocaleString()}/yr × ${years} years`;
  el('det-per-part').textContent          = fmt(perParticipant * employees * years);
  el('tip-per-part').textContent          = `$${perParticipant}/participant × ${employees} employees × ${years} years`;
  el('det-enroll-fee').textContent        = fmt(enrollFee * years);
  el('tip-enroll-fee').textContent        = `$${enrollFee}/yr × ${years} years`;
  el('det-gross-admin-total').textContent = fmt(T.grossAdmin);
  el('det-startup-cr').textContent        = '-' + fmt(T.startupCr);
  el('det-autoenroll-cr').textContent     = '-' + fmt(T.autoEnrCr);
  el('det-autoenroll-row').style.display  = (autoEnroll && T.autoEnrCr > 0) ? '' : 'none';
  el('det-admin-cr-total').textContent    = '-' + fmt(T.totalAdmCr);
  el('det-net-admin').textContent         = fmt(T.netAdmin);
  el('admin-callout-adv').innerHTML =
    `After tax credits, your net administrative cost is <strong>${fmt(T.netAdmin)}</strong> over ${years} year${years>1?'s':''} — ` +
    `covering plan setup, recordkeeping, and ongoing administration for all ${employees} employees.`;
  el('admin-r-gross-val').textContent  = fmt(T.grossAdmin);
  el('admin-r-credit-val').textContent = fmt(T.totalAdmCr);
  el('admin-r-net-val').textContent    = fmt(T.netAdmin);
  el('admin-callout-own').innerHTML =
    `Your total out-of-pocket admin cost is just <strong>${fmt(T.netAdmin)}</strong> over ${years} year${years>1?'s':''} — ` +
    `the government covers <strong>${fmt(T.totalAdmCr)}</strong> of your administrative expenses.`;

  /* Admin year table */
  const adminCols = [
    { key:'grossAdmin', label:'Gross Admin' },
    { key:'startupCr',  label:'Startup Credit',      cls:'credit-col', prefix:'-' },
    ...(autoEnroll && T.autoEnrCr > 0 ? [{ key:'autoEnrCr', label:'Auto-Enroll Credit', cls:'credit-col', prefix:'-' }] : []),
    { key:'totalAdmCr', label:'Total Credits',        cls:'credit-col', prefix:'-', bold:true },
    { key:'netAdmin',   label:'Net Admin Cost',       cls:'net-col',    bold:true },
  ];
  buildYrTable('admin', T.rows, adminCols);

  /* ── Funding Panel ── */
  el('funding-panel-subtitle').textContent = `${years}-year projection · ${employees} employees · ${contrib}% contribution rate`;
  el('eq-fund-gross').textContent          = fmt(T.grossFund);
  el('eq-fund-credit').textContent         = fmt(T.fundingCr);
  el('eq-fund-net').textContent            = fmt(T.netFund);
  el('det-gross-contrib').textContent      = fmt(T.grossFund);
  el('tip-contributions').textContent      = `${contrib}% × avg salary $${avgSalary.toLocaleString()} × ${employees} employees × ${years} years`;
  el('det-gross-fund-total').textContent   = fmt(T.grossFund);
  el('det-funding-cr').textContent         = '-' + fmt(T.fundingCr);
  el('det-fund-cr-total').textContent      = '-' + fmt(T.fundingCr);
  el('det-net-fund').textContent           = fmt(T.netFund);
  el('funding-credit-section').style.display = T.fundingCr > 0 ? '' : 'none';
  el('funding-callout-adv').innerHTML =
    `Cost/Benefit: For <strong>${fmt(T.netFund)}</strong> in net funding costs over ${years} year${years>1?'s':''}, ` +
    `you provide <strong>${fmt(T.employeeBen)}</strong> in retirement benefits to your ${employees} employees` +
    (T.fundingCr > 0 ? ` — with <strong>${fmt(T.fundingCr)}</strong> offset by the SECURE 2.0 Employer Contribution Credit` : '') + '.';
  el('funding-r-gross-val').textContent  = fmt(T.grossFund);
  el('funding-r-credit-val').textContent = fmt(T.fundingCr);
  el('funding-r-net-val').textContent    = fmt(T.netFund);
  el('funding-callout-own').innerHTML =
    `For just <strong>${fmt(T.netFund)}</strong> out of pocket over ${years} year${years>1?'s':''}, ` +
    `your employees receive <strong>${fmt(T.employeeBen)}</strong> in retirement benefits — ` +
    `that's <strong>${fmt(T.employeeBen - T.netFund)}</strong> more in benefits than it costs you.`;

  const fundingCols = [
    { key:'grossFund',  label:'Gross Contributions' },
    ...(T.fundingCr > 0 ? [{ key:'fundingCr', label:'Funding Credit', cls:'credit-col', prefix:'-' }] : []),
    { key:'netFund',         label:'Net Funding Cost', cls:'net-col', bold:true },
    { key:'employeeBenefit', label:'Employee Benefit', bold:true },
  ];
  buildYrTable('funding', T.rows, fundingCols);

  /* Reset reveals when sliders change */
  resetReveal('admin');
  resetReveal('funding');
}

/* ── Build year-by-year table ── */
function buildYrTable(prefix, rows, cols) {
  const thead = el(prefix + '-yr-thead');
  const tbody = el(prefix + '-yr-tbody');
  const tfoot = el(prefix + '-yr-tfoot');

  thead.innerHTML = '<th>Year</th>' + cols.map(c => `<th>${c.label}</th>`).join('');
  tbody.innerHTML = rows.map((r, i) =>
    `<tr>
      <td>Year ${r.yr}</td>
      ${cols.map(c => `<td class="${c.cls||''} ${c.bold?'fw-bold':''}">${(c.prefix||'')}${fmt(r[c.key])}</td>`).join('')}
    </tr>`
  ).join('');

  const totals = cols.reduce((acc, c) => {
    acc[c.key] = rows.reduce((s, r) => s + (r[c.key] || 0), 0);
    return acc;
  }, {});
  tfoot.innerHTML = '<td>Total</td>' +
    cols.map(c => `<td class="${c.cls||''} fw-bold">${(c.prefix||'')}${fmt(totals[c.key])}</td>`).join('');
}

/* ── View toggle ── */
function setView(v) {
  currentView = v;
  el('btn-advisor').classList.toggle('active', v === 'advisor');
  el('btn-owner').classList.toggle('active',   v === 'owner');
  el('advisor-view').classList.toggle('d-none', v !== 'advisor');
  el('owner-view').classList.toggle('d-none',   v !== 'owner');

  /* Sync panel views if open */
  ['admin','funding'].forEach(p => {
    el(p + '-advisor-content').classList.toggle('d-none', v !== 'advisor');
    el(p + '-client-content').classList.toggle('d-none',  v !== 'owner');
  });

  /* Auto-start reveal if client view and panel open */
  if (v === 'owner') {
    ['admin','funding'].forEach(p => {
      if (el(p + '-panel').classList.contains('open')) startReveal(p);
    });
  }
}

/* ── Panel open/close ── */
function openPanel(name) {
  el(name + '-backdrop').classList.add('open');
  el(name + '-panel').classList.add('open');
  if (currentView === 'owner') startReveal(name);
}
function closePanel(name) {
  el(name + '-backdrop').classList.remove('open');
  el(name + '-panel').classList.remove('open');
}

/* ── Progressive reveal ── */
function startReveal(name) {
  resetReveal(name);
  setTimeout(() => {
    show_reveal(name, 'gross');
    el(name + '-reveal-btn').style.display = '';
    el(name + '-reveal-btn').textContent = 'Show Tax Credits →';
    revealStep[name] = 1;
  }, 400);
}

function advanceReveal(name) {
  const step = revealStep[name];
  if (step === 1) {
    show_reveal(name, 'credit-row');
    el(name + '-reveal-btn').textContent = 'Show Net Cost →';
    revealStep[name] = 2;
  } else if (step === 2) {
    show_reveal(name, 'divider');
    show_reveal(name, 'net-row');
    el(name + '-reveal-btn').style.display  = 'none';
    el(name + '-replay-btn').style.display  = '';
    revealStep[name] = 3;
  }
}

function resetReveal(name) {
  revealStep[name] = 0;
  ['gross','credit-row','divider','net-row'].forEach(part => {
    const e = el(name + '-r-' + part);
    if (e) { e.classList.add('hidden'); e.classList.remove('visible'); }
  });
  el(name + '-reveal-btn').style.display  = 'none';
  el(name + '-replay-btn').style.display  = 'none';
}

function show_reveal(name, part) {
  const e = el(name + '-r-' + part);
  if (!e) return;
  e.classList.remove('hidden');
  requestAnimationFrame(() => e.classList.add('visible'));
}

/* ── Slider change handler ── */
let sliderDebounce = null;
function onSliderChange() {
  clearTimeout(sliderDebounce);
  sliderDebounce = setTimeout(() => submitForm(), 400);
}

/* ── Init ── */
render();