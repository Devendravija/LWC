import { LightningElement, track } from 'lwc';
import saveInvestment from '@salesforce/apex/SIPCalculatorController.saveInvestment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ChartJs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';

export default class SipCalculator extends LightningElement {

    chartLoaded = false;

    // LUMP SUM
    lumpAmount = 5000;
    lumpYears = 5;
    lumpRate = 10;

    lumpInvested = 0;
    lumpReturns = 0;
    lumpTotal = 0;

    // SIP
    sipAmount = 2000;
    sipYears = 5;
    sipRate = 10;

    sipInvested = 0;
    sipReturns = 0;
    sipTotal = 0;

    connectedCallback(){
        this.calculateLump();
        this.calculateSip();
    }

    renderedCallback(){
        if(this.chartLoaded) return;

        loadScript(this, ChartJs)
        .then(()=>{
            this.chartLoaded = true;
            this.renderCharts();
        });
    }

    // 🔹 LUMP CALCULATION
    calculateLump(){
        let P = this.lumpAmount;
        let r = this.lumpRate / 100;
        let t = this.lumpYears;

        let total = P * Math.pow((1 + r), t);

        this.lumpInvested = P;
        this.lumpTotal = total.toFixed(2);
        this.lumpReturns = (total - P).toFixed(2);

        this.updateChart('lump');
    }

    // 🔹 SIP CALCULATION
    calculateSip(){
        let P = this.sipAmount;
        let r = this.sipRate / 100;
        let t = this.sipYears;

        let total = P * ((Math.pow((1 + r), t) - 1) / r);

        let invested = P * t * 12;

        this.sipInvested = invested.toFixed(2);
        this.sipTotal = total.toFixed(2);
        this.sipReturns = (total - invested).toFixed(2);

        this.updateChart('sip');
    }

    handleLumpChange(event){
        let label = event.target.label;

        if(label.includes('Amount')) this.lumpAmount = event.target.value;
        if(label.includes('Duration')) this.lumpYears = event.target.value;
        if(label.includes('Return')) this.lumpRate = event.target.value;

        this.validate();
        this.calculateLump();
    }

    handleSipChange(event){
        let label = event.target.label;

        if(label.includes('Amount')) this.sipAmount = event.target.value;
        if(label.includes('Duration')) this.sipYears = event.target.value;
        if(label.includes('Return')) this.sipRate = event.target.value;

        this.validate();
        this.calculateSip();
    }

    // 🔹 VALIDATION
    validate(){
        if(this.lumpRate < 1 || this.lumpRate > 30){
            this.showToast('Error','Rate must be 1-30%','error');
        }
    }

    // 🔹 SAVE
    saveLump(){
        this.saveRecord('Lumpsum', this.lumpAmount, this.lumpYears, this.lumpRate,
            this.lumpTotal, this.lumpInvested, this.lumpReturns);
    }

    saveSip(){
        this.saveRecord('SIP', this.sipAmount, this.sipYears, this.sipRate,
            this.sipTotal, this.sipInvested, this.sipReturns);
    }

    saveRecord(type, amount, years, rate, total, invested, returns){
        saveInvestment({
            type: type,
            amount: amount,
            duration: years,
            rate: rate,
            totalValue: total,
            invested: invested,
            returns: returns
        })
        .then(()=>{
            this.showToast('Success','Investment Saved','success');
        })
        .catch(error=>{
            this.showToast('Error', error.body.message,'error');
        });
    }

    // 🔹 CHART
    renderCharts(){
        const ctx1 = this.template.querySelector('.lumpChart');
        const ctx2 = this.template.querySelector('.sipChart');

        this.lumpChart = new window.Chart(ctx1, {
            type: 'doughnut',
            data: { datasets: [{ data: [this.lumpInvested, this.lumpReturns] }] }
        });

        this.sipChart = new window.Chart(ctx2, {
            type: 'doughnut',
            data: { datasets: [{ data: [this.sipInvested, this.sipReturns] }] }
        });
    }

    updateChart(type){
        if(!this.chartLoaded) return;

        if(type === 'lump'){
            this.lumpChart.data.datasets[0].data =
                [this.lumpInvested, this.lumpReturns];
            this.lumpChart.update();
        }

        if(type === 'sip'){
            this.sipChart.data.datasets[0].data =
                [this.sipInvested, this.sipReturns];
            this.sipChart.update();
        }
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}