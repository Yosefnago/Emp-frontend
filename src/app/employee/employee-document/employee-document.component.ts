import { CommonModule, NgOptimizedImage } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NotificationService } from "../../services/notificationService.service";


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
        
    personalId!: string;
    constructor(private route: ActivatedRoute,private http:HttpClient,private notificationService:NotificationService) {}

    ngOnInit(): void {
        this.personalId = this.route.snapshot.params['personalId'];
        this.loadFiles();
    }

    loadFiles(){
        const id = this.route.snapshot.paramMap.get('personalId');
        this.http.get<any[]>(`http://localhost:8090/files/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }).subscribe({
            next: (data) => this.documents = data,
            
        });
    }
    uploadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        const id = this.route.snapshot.paramMap.get('personalId');
        
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        this.isUploadingFile = true;

        this.http.post<any>(
            `http://localhost:8090/files/upload/${id}`,
            formData,
            {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            }
        ).subscribe({
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

        const token = sessionStorage.getItem('token');
        
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` 
        });

        const config = {
            headers: headers,
            responseType: 'blob' as 'json' 
        };

        this.http.get<Blob>(
            `http://localhost:8090/files/download/${item.name}`,
            config 
        ).subscribe({
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
    deleteDoc(item: any, event: MouseEvent){
        
        event.stopPropagation();
        if (!confirm(`Delete ${item.name}?`)) return;

        this.http.delete(
            `http://localhost:8090/files/delete/${item.name}`,
            {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            }
        ).subscribe({
            next: () => {
                this.notificationService.show('הקובץ נמחק בהצלחה', true);
                this.loadFiles();
            },
            error: () => {
                this.notificationService.show('שגיאה במחיקה הקובץ', false);
            }
        });

    }
    showDoc(item: any, event: MouseEvent) {
        event.stopPropagation();

        this.http.get(
            `http://localhost:8090/files/show/${item.id}`,
            {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            }
        ).subscribe({
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