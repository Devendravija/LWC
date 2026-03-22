import { LightningElement, track } from 'lwc';

export default class SingleSelectCombobox extends LightningElement {

    @track searchKey = '';
    selectedValue = '';

    options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Mango', value: 'mango' },
        { label: 'Orange', value: 'orange' }
    ];

    get filteredOptions() {
        return this.options.filter(opt =>
            opt.label.toLowerCase().includes(this.searchKey.toLowerCase())
        );
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
    }

    clearSelection() {
        this.selectedValue = '';
    }
}