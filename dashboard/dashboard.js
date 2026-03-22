import { LightningElement } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';
import getDashboardData from '@salesforce/apex/DashboardController.getDashboardData';

export default class Dashboard extends LightningElement {

    chartLoaded = false;
    year = new Date().getFullYear();

    stageChart;
    typeChart;
    monthChart;

    yearOptions = [
        { label: '2023', value: 2023 },
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 }
    ];

    renderedCallback() {
        if (this.chartLoaded) return;

        this.chartLoaded = true;

        loadScript(this, chartjs)
            .then(() => {
                this.loadData();
            });
    }

    loadData() {
        getDashboardData({ yearVal: this.year })
            .then(data => {
                this.renderCharts(data);
            })
            .catch(error => console.error(error));
    }

    renderCharts(data) {

        // Destroy old charts
        if (this.stageChart) this.stageChart.destroy();
        if (this.typeChart) this.typeChart.destroy();
        if (this.monthChart) this.monthChart.destroy();

        // Stage Chart (Bar)
        this.stageChart = new window.Chart(
            this.template.querySelector('.stageChart'),
            {
                type: 'bar',
                data: {
                    labels: data.stageData.map(x => x.stage),
                    datasets: [{
                        label: 'By Stage',
                        data: data.stageData.map(x => x.cnt)
                    }]
                }
            }
        );

        // Type Chart (Pie)
        this.typeChart = new window.Chart(
            this.template.querySelector('.typeChart'),
            {
                type: 'pie',
                data: {
                    labels: data.typeData.map(x => x.type),
                    datasets: [{
                        data: data.typeData.map(x => x.cnt)
                    }]
                }
            }
        );

        // Monthly Chart (Line)
        this.monthChart = new window.Chart(
            this.template.querySelector('.monthChart'),
            {
                type: 'line',
                data: {
                    labels: data.monthData.map(x => 'Month ' + x.month),
                    datasets: [{
                        label: 'Monthly',
                        data: data.monthData.map(x => x.cnt)
                    }]
                }
            }
        );
    }

    handleYearChange(event) {
        this.year = event.detail.value;
        this.loadData();
    }

    refreshData() {
        this.loadData();
    }
}