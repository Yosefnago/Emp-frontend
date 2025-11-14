import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";


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

    document = [
        {
            name: "contract.pdf",
            path: "contract.pdf",
            is_folder: false,
            isFolder: false
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "salary.xlsx",
            path: "salary.xlsx",
            is_folder: false,
            isFolder: false
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        {
            name: "photos",
            path: "photos",
            is_folder: true,
            isFolder: true
        },
        
    ];
    personalId!: string;
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.personalId = this.route.snapshot.params['personalId']!;
    }
    download(item: any, event: Event){

    }
    deleteDoc(item: any, event: Event){

    }
    showDoc(item: any, event: Event){

    }
}