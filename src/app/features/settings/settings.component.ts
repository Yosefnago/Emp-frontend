// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings-service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'profile';
  username: string = '';
  companyName: string = '';
  companyId: string = '';
  companyAddress: string = '';
  email: string = '';
  phone: string = '';

  constructor(private router: Router,private settingsService: SettingsService) {}

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };


  notificationSettings = [
    { id: 1, title: 'התראות עבודה', description: 'הודעות על משימות ופרויקטים', enabled: true },
    { id: 2, title: 'התראות משכורת', description: 'הודעות על משכורה וקיזוזים', enabled: true },
    { id: 3, title: 'התראות נוכחות', description: 'הודעות על נוכחות וחסרות', enabled: false },
    { id: 4, title: 'התראות אירועים', description: 'הודעות על אירועים קרובים', enabled: true },
    { id: 5, title: 'התראות מערכת', description: 'הודעות חשובות של המערכת', enabled: true },
    { id: 6, title: 'עדכוני בטיחות', description: 'הודעות על עדכונים בטיחותיים', enabled: true }
  ];

  channels = {
    email: true,
    push: true,
    sms: false
  };

  preferences = {
    language: 'he',
    theme: 'light',
    timeFormat: '24h',
    analyticsEnabled: true,
    crashReports: true
  };


  ngOnInit(): void {
    this.getUserProfile();
  }
  getUserProfile(): void {
    this.settingsService.getUserProfile().subscribe({
      next: (response) => {
        this.username = response.username;
        this.companyName = response.companyName;
        this.companyId = response.companyId;
        this.companyAddress = response.companyAddress;
        this.email = response.email;
        this.phone = response.phone;
        
        console.log('User profile data:', response);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

 
  goBack(): void {
    this.router.navigate(['/home']);
  }
}