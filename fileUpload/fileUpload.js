import { LightningElement, api, track } from 'lwc';
import uploadFileApex from '@salesforce/apex/FileUploadController.uploadFile';

export default class FileUpload extends LightningElement {
  @api recordId;

  @track fileData;
  @track fileName;
  @track filePreviewUrl;
  @track isUploading = false;
  @track status;

  // Getter for disabling the button
  get isUploadDisabled() {
    return this.isUploading || !this.fileData;
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      this.fileData = undefined;
      this.filePreviewUrl = undefined;
      return;
    }
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      // full data URI: "data:image/png;base64,iVBORw0KGgoAAAANS..."
      this.fileData = reader.result;
      this.filePreviewUrl = reader.result; // this drives the <img> src
    };
   reader.onerror = (err) => {
      this.status = 'Error reading file: ' + err;
    };
    reader.readAsDataURL(file);
  }

    uploadFile() {
  // 1) Ensure recordId is present
  if (!this.recordId) {
    this.status = 'Error: No record context. Please add this component to a record page.';
    return;
  }
  if (!this.fileData) {
    this.status = 'Please choose a file first.';
    return;
  }

  this.isUploading = true;
  this.status = 'Uploading...';

  uploadFileApex({
    parentId   : this.recordId,
    base64Data : this.fileData,
    fileName   : this.fileName
  })
  .then((newVersionId) => {
    this.status = 'Upload successful! Version Id: ' + newVersionId;
  })
  .catch((error) => {
    console.error('Upload failed:', error);
    // Extract human message...
    let msg = (error.body?.pageErrors?.[0]?.message)
               || error.body?.message
               || error.message
               || 'Unknown error';
    this.status = 'Upload failed: ' + msg;
  })
  .finally(() => {
    this.isUploading = false;
  });
}
}
