import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NotificationService } from "../../services/notificationService.service";
import { EmployeeService } from "../../services/employee.service";


@Component({
    selector: 'app-employee-document',
    standalone: true,
    styleUrls: ['./employee-document.component.css'],
    templateUrl: './employee-document.component.html',
    imports:
    [
        CommonModule,
        NgOptimizedImage,
        RouterLink
    ]

})

export class EmployeeDocumentComponent{

    documents :any[] = [];
    showUploadDocumentModal = false;
    isUploadingFile = false;
    selectedFiles: File[] = [];
        
    personalId: string = '';

    constructor(
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private notificationService:NotificationService) {}

    ngOnInit(): void {
        this.personalId = this.route.snapshot.params['personalId'];
        this.loadFiles();
    }

    loadFiles(){
        this.employeeService.loadFiles(this.personalId).subscribe({
            next: (data) => this.documents = data,
            error:() => this.notificationService.show('שגיאה בטעינת מסמכים',false)
        });
    }
    uploadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;

        if (!input.files || input.files.length === 0) return;

        const formData = new FormData();
        
        Array.from(input.files).forEach(file => {
            formData.append("file", file); 
        });

        this.isUploadingFile = true;

        this.employeeService.uploadFile(formData,this.personalId).subscribe({
            next: () => {
                this.isUploadingFile = false;
                this.notificationService.show("ההעלאה בוצעה בהצלחה", true);
                input.value = '';
                this.closeUploadDocumentModal();
                this.loadFiles();
            },
            error: () => {
                this.isUploadingFile = false;
                this.notificationService.show('שגיאה בהעלאה', false);
            }
        });
    }
    
    getFileName(path: string): string {
        return path.split("\\").pop() || path;
    }
    download(item: any, event: Event) {
        event.stopPropagation();

        this.employeeService.downloadFile(item.name).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = item.name;
                a.click();
                window.URL.revokeObjectURL(url);
                this.notificationService.show('ההורדה בוצעה', true);
            },
            error: () => this.notificationService.show('הורדה נכשלה', false)
        });
    }
    deleteDoc(item: any, event: MouseEvent) {
        event.stopPropagation();

        if (!confirm(`Delete ${item.name}?`)) return;

        this.employeeService.deleteFile(item.name).subscribe({
            next: () => {
                this.notificationService.show('הקובץ נמחק בהצלחה', true);
                this.loadFiles();
            },
            error: () => {
                this.notificationService.show('שגיאה במחיקת הקובץ', false);
            }
        });
    }
    showDoc(item: any, event: MouseEvent) {
        event.stopPropagation();

        this.employeeService.showFile(item.id).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
            },
            error: () => {
                this.notificationService.show('אין הרשאה לפתיחת הקובץ', false);
            }
        });
    }
    openUploadDocumentModal(){
        this.showUploadDocumentModal = true;
    }
    closeUploadDocumentModal(){
        this.showUploadDocumentModal = false;
    }
    onFileChange(event: any) {
        this.selectedFiles = Array.from(event.target.files);
    }
}