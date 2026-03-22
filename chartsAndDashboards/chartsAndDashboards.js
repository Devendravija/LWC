import { LightningElement, wire } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';
import getChartData from '@salesforce/apex/chartsAndDashboards.getOpportunityRecord';

export default class ChartsDashboard extends LightningElement {

    chart;
    chartLoaded = false;
    chartType = 'bar';
    data;

    options = [
        { label: 'Bar', value: 'bar' },
        { label: 'Line', value: 'line' },
        { label: 'Pie', value: 'pie' },
        { label: 'Doughnut', value: 'doughnut' },
        { label: 'Radar', value: 'radar' },
        { label: 'PolarArea', value: 'polarArea' }
    ];

   
    @wire(getChartData)
    wiredChartData({ error, data }) {
        if (error) {
            console.error(error);
        } else if (data) {
            
            this.data = {
                labels: data.map(item => item.label),
                counts: data.map(item => item.Count)
            };

           
            if (this.chartLoaded) {
                this.renderChart();
            }
        }
    }

    
    renderedCallback() {
        if (this.chartLoaded) return;

        loadScript(this, chartjs)
            .then(() => {
                console.log('ChartJS Loaded');

                // Debug
                console.log('Chart Object:', window.Chart);

                this.chartLoaded = true;

                if (this.data) {
                    this.renderChart();
                }
            })
            .catch(error => {
                console.error('Error loading ChartJS', error);
            });
    }

    
    renderChart() {
        if (!this.data) return;

        const canvas = this.template.querySelector('.chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        
        if (this.chart) {
            this.chart.destroy();
        }

        
        const ChartLib = window.Chart?.default || window.Chart;

        if (!ChartLib) {
            console.error('Chart library not found');
            return;
        }

        this.chart = new ChartLib(ctx, {
            type: this.chartType,
            data: {
                labels: this.data.labels,
                datasets: [{
                    label: 'Opportunities by Stage',
                    data: this.data.counts,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    
    handleChange(event) {
        this.chartType = event.detail.value;
        this.renderChart();
    }
}