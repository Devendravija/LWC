import { LightningElement, wire, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class CustomTableUiApi extends LightningElement {

    @track data = [];
    @track filteredData = [];
    @track paginatedData = [];
    @track selectedIds = [];
    @track isLoading = false;

    page = 1;
    pageSize = 5;

    searchKey = '';
    sortBy = 'Name';
    sortDir = 'asc';

    wiredResult;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Stage', fieldName: 'StageName' },
        { label: 'Amount', fieldName: 'Amount' },
        { label: 'Close Date', fieldName: 'CloseDate' }
    ];

    // 🔄 FETCH DATA (UI API)
    @wire(getListUi, {
        objectApiName: OPPORTUNITY_OBJECT,
        listViewApiName: 'AllOpportunities',
        pageSize: 50
    })
    wiredList(result) {
        this.wiredResult = result;

        if (result.data) {
            this.data = result.data.records.records.map(r => {

    const record = {
        Id: r.id,
        Name: r.fields.Name.value,
        StageName: r.fields.StageName.value,
        Amount: r.fields.Amount.value,
        CloseDate: r.fields.CloseDate.value,
        Image_URL__c: 'https://via.placeholder.com/40',
        isEdit: false,
        stageIcon: this.getStageIcon(r.fields.StageName.value)
    };

    // 🔥 CREATE CELLS ARRAY
    record.cells = [
        { field: 'Name', value: record.Name },
        { field: 'StageName', value: record.StageName, isStage: true },
        { field: 'Amount', value: record.Amount },
        { field: 'CloseDate', value: record.CloseDate }
    ];

    return record;
});


            this.applyFilterSort();
        }
    }

    // 🎯 ICON LOGIC
    getStageIcon(stage) {
        if (stage === 'Closed Won') return 'utility:success';
        if (stage === 'Closed Lost') return 'utility:error';
        return 'utility:clock';
    }

    // 🔍 SEARCH + SORT
    applyFilterSort() {
        let temp = [...this.data];

        if (this.searchKey) {
            temp = temp.filter(r =>
                r.Name.toLowerCase().includes(this.searchKey.toLowerCase())
            );
        }

        temp.sort((a, b) => {
            let v1 = a[this.sortBy] || '';
            let v2 = b[this.sortBy] || '';

            return this.sortDir === 'asc'
                ? v1 > v2 ? 1 : -1
                : v1 < v2 ? 1 : -1;
        });

        this.filteredData = temp;
        this.setPagination();
    }

    // 📄 PAGINATION
    setPagination() {
        let start = (this.page - 1) * this.pageSize;
        let end = start + this.pageSize;
        this.paginatedData = this.filteredData.slice(start, end);
    }

    get totalPages() {
        return Math.ceil(this.filteredData.length / this.pageSize);
    }

    nextPage() {
        if (this.page < this.totalPages) {
            this.page++;
            this.setPagination();
        }
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.setPagination();
        }
    }

    // 🔍 SEARCH
    handleSearch(event) {
        this.searchKey = event.target.value;
        this.applyFilterSort();
    }

    // 🔃 SORT
    handleSort(event) {
        this.sortBy = event.target.dataset.field;
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.applyFilterSort();
    }

    // ✅ SELECT
    handleSelect(event) {
        const id = event.target.dataset.id;

        if (event.target.checked) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds = this.selectedIds.filter(i => i !== id);
        }
    }

    // ✏️ EDIT MODE
    handleEdit(event) {
    const id = event.target.dataset.id;

    this.data = this.data.map(r => {
        if (r.Id === id) {
            return {
                ...r,
                isEdit: true,
                cells: [...r.cells] // 🔥 force reactivity
            };
        }
        return r;
    });

    this.applyFilterSort();
}

    handleEditChange(event) {
        const id = event.target.dataset.id;
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.data = this.data.map(r => {
            if (r.Id === id) r[field] = value;
            return r;
        });
    }

    // 💾 SAVE
    handleSave(event) {
        const id = event.target.dataset.id;
        const row = this.data.find(r => r.Id === id);

        const fields = {};
        fields['Id'] = row.Id;
        fields[NAME_FIELD.fieldApiName] = row.Name;
        fields[STAGE_FIELD.fieldApiName] = row.StageName;
        fields[AMOUNT_FIELD.fieldApiName] = row.Amount;
        fields[CLOSEDATE_FIELD.fieldApiName] = row.CloseDate;

        updateRecord({ fields })
            .then(() => {
                this.showToast('Success', 'Updated', 'success');
                this.refreshData();
            });
    }

    // ➕ CREATE
    handleCreate() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = 'New Opportunity';
        fields[STAGE_FIELD.fieldApiName] = 'Prospecting';
        fields[CLOSEDATE_FIELD.fieldApiName] = new Date().toISOString();

        createRecord({ apiName: OPPORTUNITY_OBJECT.objectApiName, fields })
            .then(() => {
                this.showToast('Created', 'Record created', 'success');
                this.refreshData();
            });
    }

    // ❌ DELETE
    handleDelete(event) {
        const id = event.target.dataset.id;

        deleteRecord(id)
            .then(() => {
                this.showToast('Deleted', 'Record deleted', 'success');
                this.refreshData();
            });
    }

    // ❌ BULK DELETE
    handleBulkDelete() {
        Promise.all(this.selectedIds.map(id => deleteRecord(id)))
            .then(() => {
                this.showToast('Deleted', 'Bulk delete success', 'success');
                this.selectedIds = [];
                this.refreshData();
            });
    }

    // 📤 EXPORT CSV
    handleExport() {
        let csv = 'Name,Stage,Amount,CloseDate\n';

        this.filteredData.forEach(r => {
            csv += `${r.Name},${r.StageName},${r.Amount},${r.CloseDate}\n`;
        });

        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'Opportunities.csv';
        a.click();
    }

    // 🔄 REFRESH
    refreshData() {
        refreshApex(this.wiredResult);
    }

    // 🔔 TOAST
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}