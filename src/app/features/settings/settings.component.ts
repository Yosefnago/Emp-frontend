// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings-service';
import { SystemMessages } from '../../core/services/system-messages.service';

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

  constructor(private router: Router, private settingsService: SettingsService, private systemMessage: SystemMessages) { }

  passwordData = {
    oldPass: '',
    newPass: '',
    newPassAgain: ''
  };



  isEditingProfile: boolean = false;

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
        this.phone = response.phoneNumber;
      }
    });
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
  }

  saveProfile(): void {
    const profileData = {
      username: this.username,
      companyName: this.companyName,
      companyId: this.companyId,
      companyAddress: this.companyAddress,
      email: this.email,
      phoneNumber: this.phone
    };

    this.settingsService.updateUserProfile(profileData).subscribe({
      next: () => {
        this.isEditingProfile = false;
      }
    });
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.getUserProfile();
  }

  saveSecurity(): void {


    if (this.passwordData.newPass !== this.passwordData.newPassAgain
      || this.passwordData.oldPass.trim() === '' || this.passwordData.newPass.trim() === ''
      || this.passwordData.newPassAgain.trim() === ''

    ) {
      this.systemMessage.show('הסיסמאות החדשות אינן תואמות או שדות ריקים', false);
      return;
    }

    this.settingsService.updateSecuritySettings(this.passwordData).subscribe({
      next: (response) => {
        this.systemMessage.show(response.message, response.success);
        this.passwordData = { oldPass: '', newPass: '', newPassAgain: '' };
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