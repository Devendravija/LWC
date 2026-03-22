import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ChartsAndDashboardsChild extends LightningElement {

    chart;
    isChartJsInitialized = false;

    _chartType = 'bar';
    _chartData;

    @api
    set chartType(value) {
        this._chartType = value;
        this.renderChart();
    }

    @api
    set chartData(value) {
        this._chartData = value;
        this.renderChart();
    }

    renderedCallback() {
        if (this.isChartJsInitialized) return;

        this.isChartJsInitialized = true;

        loadScript(this, chartjs)
            .then(() => {
                console.log('✅ ChartJS Loaded:', window.Chart);
                this.renderChart();
            })
            .catch(error => {
                console.error('❌ Load Error:', error);
            });
    }

    renderChart() {
        // 🔥 HARD CHECK (prevents script error)
        if (!window.Chart) {
            console.error('❌ ChartJS NOT available');
            return;
        }

        if (!this._chartData) {
            console.warn('⚠ No data yet');
            return;
        }

        const canvas = this.template.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        try {
            this.chart = new window.Chart(ctx, {
                type: this._chartType || 'bar',
                data: {
                    labels: this._chartData.labels || [],
                    datasets: [{
                        label: 'Opportunities',
                        data: this._chartData.counts || [],
                        backgroundColor: [
                            '#FF6384','#36A2EB','#FFCE56',
                            '#4BC0C0','#9966FF','#FF9F40'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } catch (err) {
            console.error('🔥 Chart Render Error:', err);
        }
    }
}