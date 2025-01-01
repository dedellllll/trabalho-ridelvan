document.addEventListener('DOMContentLoaded', () => {
    const toggleTransactionBtn = document.getElementById('toggle-transaction');
    const transactionOptions = document.getElementById('transaction-options');
    const transactionInput = document.getElementById('transaction-input');
     const transactionDescriptionInput = document.getElementById('transaction-description');
    const confirmTransactionBtn = document.getElementById('confirm-transaction');
    const amountInputGastoInvest = document.getElementById('transaction-amount-gasto-invest');
    const saldoValueDisplay = document.getElementById('saldo-value');
     const metaSaldoValueDisplay = document.getElementById('meta-saldo-value');
    const gastosValueDisplay = document.getElementById('gastos-value');
    const investidosValueDisplay = document.getElementById('investidos-value');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const closeQrCodeBtn = document.getElementById('close-qr-code-btn');
    const confirmSaldoBtn = document.getElementById('confirm-saldo-btn');
    const amountInputSaldo = document.getElementById('transaction-amount');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    let currentTransactionType = null;
     let saldo = parseFloat(localStorage.getItem('saldo') || 0);
    let gastos = parseFloat(localStorage.getItem('gastos') || 0);
    let investidos = parseFloat(localStorage.getItem('investidos') || 0);
     let metaSaldo = parseFloat(localStorage.getItem('metaSaldo') || 0);
    let gastosHistory = JSON.parse(localStorage.getItem('gastosHistory') || '[]');
      let lastResetMonth = localStorage.getItem('lastResetMonth');


    function animateValueChange(displayElement, startValue, endValue, duration = 500) {
        const steps = 20;
        const increment = (endValue - startValue) / steps;
        let currentValue = startValue;
        let stepCount = 0;

         // Define a opacidade inicial como 0 para fade in
         displayElement.style.opacity = '0';
        
         const animationInterval = setInterval(() => {
            currentValue += increment;
            displayElement.textContent = `R$ ${currentValue.toFixed(2)}`;
            stepCount++;
            
            // Começa o fade in após o primeiro passo
            if(stepCount === 1){
                displayElement.style.transition = 'opacity 0.2s ease-in'; // Ajuste a duração para fade in mais rápido
                displayElement.style.opacity = '1';
            }


            if (stepCount >= steps) {
                clearInterval(animationInterval);
                displayElement.textContent = `R$ ${endValue.toFixed(2)}`;
                displayElement.style.transition = 'opacity 0.5s ease-out';
                displayElement.style.opacity = '0.9'; // Mantem opacidade no fim da animação
                setTimeout(()=> {
                    displayElement.style.opacity = '1'; // Restaura opacidade após um curto tempo
                   
                }, 300);
            }
        }, duration / steps);
    }
  function updateDisplay() {
        animateValueChange(saldoValueDisplay, parseFloat(saldoValueDisplay.textContent.replace('R$ ', '')), saldo);
       animateValueChange(metaSaldoValueDisplay, parseFloat(metaSaldoValueDisplay.textContent.replace('R$ ', '')), metaSaldo);
        animateValueChange(gastosValueDisplay, parseFloat(gastosValueDisplay.textContent.replace('R$ ', '')), gastos);
        animateValueChange(investidosValueDisplay, parseFloat(investidosValueDisplay.textContent.replace('R$ ', '')), investidos);
    }
    function saveToLocalStorage() {
            localStorage.setItem('saldo', saldo.toString());
            localStorage.setItem('gastos', gastos.toString());
            localStorage.setItem('investidos', investidos.toString());
            localStorage.setItem('gastosHistory', JSON.stringify(gastosHistory));
             localStorage.setItem('metaSaldo', metaSaldo.toString());
        }
        
    updateDisplay();
    
      // Adiciona a classe visible após um pequeno atraso para criar a animação
    setTimeout(() => {
         toggleTransactionBtn.classList.add('visible');
    }, 100);

    toggleTransactionBtn.addEventListener('click', () => {
        transactionOptions.classList.toggle('hidden');
        transactionOptions.classList.toggle('visible'); // Mostra as opções com animação
        transactionInput.classList.add('hidden');
        transactionInput.classList.remove('visible'); // Esconde a input
         qrCodeContainer.classList.add('hidden');
         qrCodeContainer.classList.remove('visible') // esconde o qr code caso esteja aberto
    });

    transactionOptions.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            currentTransactionType = event.target.dataset.type;
                transactionOptions.classList.add('hidden');
             transactionOptions.classList.remove('visible')
             if(currentTransactionType === 'saldo' || currentTransactionType === 'investidos' || currentTransactionType === 'meta'){
                 qrCodeContainer.classList.remove('hidden')
                 qrCodeContainer.classList.add('visible') //Mostra o qr code
                  transactionInput.classList.add('hidden');
                   transactionInput.classList.remove('visible');
             } else {
                    transactionInput.classList.remove('hidden');
                     transactionInput.classList.add('visible'); // Mostra a input com animação
                 qrCodeContainer.classList.add('hidden');
                 qrCodeContainer.classList.remove('visible') // esconde o qr code caso esteja aberto
             }
        }
    });
        closeQrCodeBtn.addEventListener('click', () => {
            qrCodeContainer.classList.add('hidden');
            qrCodeContainer.classList.remove('visible'); // Esconde o qr code
            transactionOptions.classList.remove('hidden');
              transactionOptions.classList.add('visible'); // Mostra o menu de transações
            
        });
    
    confirmTransactionBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInputGastoInvest.value);
         const description = transactionDescriptionInput.value;
        if (!isNaN(amount)) {
             amountInputGastoInvest.value = '';
             transactionDescriptionInput.value = '';
            switch (currentTransactionType) {
                case 'gastos':
                     if(saldo >= amount){
                        saldo -= amount;
                        gastos += amount;
                        const now = new Date();
                        gastosHistory.push({ amount, description, date: now.toLocaleDateString(), time: now.toLocaleTimeString() });
                     } else {
                        alert("Saldo insuficiente!")
                        return;
                    }
                    break;
                default:
                    break;
            }
            updateDisplay();
            transactionInput.classList.add('hidden');
              transactionInput.classList.remove('visible'); // Esconde a input com animação
        }
         saveToLocalStorage()
    });
     confirmSaldoBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInputSaldo.value);
        if (!isNaN(amount)) {
             amountInputSaldo.value = '';
               if (currentTransactionType === 'saldo') {
                    saldo += amount;
                } else if(currentTransactionType === 'meta'){
                  metaSaldo += amount;
                 } else if(currentTransactionType === 'investidos'){
                     if(saldo >= amount){
                        saldo -= amount;
                        investidos += amount;
                    } else{
                        alert("Saldo Insuficiente!")
                        return;
                    }
                }
            updateDisplay();
            qrCodeContainer.classList.add('hidden');
              qrCodeContainer.classList.remove('visible'); // Esconde o qr code com animação
              transactionOptions.classList.remove('hidden');
            transactionOptions.classList.add('visible');
        }
          saveToLocalStorage()
    });
     window.addEventListener('beforeunload', () => {
            saveToLocalStorage(); // Salva os dados antes de fechar a página
        });

    exportCsvBtn.addEventListener('click', () => {
        const data = {
            saldo: saldo,
              metaSaldo: metaSaldo,
            gastos: gastos,
            investidos: investidos,
            gastosHistory: gastosHistory
        };
        const csv = convertToCSV(data);
        downloadCSV(csv, 'financeiro.csv');
    });

  function convertToCSV(data) {
    const header = ["Tipo", "Valor", "Descrição", "Data", "Hora"];
    const rows = [];
    rows.push(["Saldo", data.saldo, "", "", ""]);
     rows.push(["Meta Saldo", data.metaSaldo, "", "", ""]);
    rows.push(["Gastos", data.gastos, "", "", ""]);
    rows.push(["Investidos", data.investidos, "", "", ""]);
        rows.push(["", "", "", "", ""]);
        rows.push(header);
            data.gastosHistory.forEach(gasto => {
                rows.push(['Gasto', gasto.amount, gasto.description, gasto.date, gasto.time]);
            });
            return rows.map(row => row.join(',')).join('\n');
        }
  function downloadCSV(csv, filename) {
            const csvFile = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(csvFile);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function resetMonthlyData() {
          const now = new Date();
          const currentMonth = now.getMonth();


          if (lastResetMonth === null || lastResetMonth != currentMonth) {
              if(lastResetMonth !== null){
               const data = {
                    saldo: saldo,
                     metaSaldo: metaSaldo,
                    gastos: gastos,
                    investidos: investidos,
                    gastosHistory: gastosHistory
                };
                const csv = convertToCSV(data);
                const lastMonth = lastResetMonth === 0 ? 11 : lastResetMonth - 1;
                const lastMonthName = new Date(now.getFullYear(),lastMonth).toLocaleString('default',{month: 'long'})
                downloadCSV(csv,`financeiro_${lastMonthName}.csv`);

              }
            localStorage.clear();
            localStorage.setItem('lastResetMonth',currentMonth)
            saldo = 0;
             gastos = 0;
             investidos = 0;
             metaSaldo = 0;
              gastosHistory = [];
            updateDisplay();
          }

      }
   resetMonthlyData();
});