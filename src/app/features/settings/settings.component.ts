// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'profile';

  user = {
    firstName: 'יוסף',
    lastName: 'נג',
    email: 'yosef@company.com',
    phone: '050-1234567',
    birthDate: '1995-03-15',
    location: 'תל אביב, ישראל',
    bio: 'Senior Developer | Spring Boot Expert | Java Enthusiast',
    twoFactorEnabled: false
  };

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  activeSessions = [
    {
      id: 1,
      deviceType: 'Windows 10',
      browser: 'Chrome',
      location: 'תל אביב, ישראל',
      lastActive: new Date(),
      isCurrent: true
    },
    {
      id: 2,
      deviceType: 'iPhone 13',
      browser: 'Safari',
      location: 'תל אביב, ישראל',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isCurrent: false
    },
    {
      id: 3,
      deviceType: 'MacBook Pro',
      browser: 'Safari',
      location: 'ירושלים, ישראל',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isCurrent: false
    }
  ];

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] + lastName[0]).toUpperCase();
  }

  saveProfile(): void {
    alert('פרופיל שמור בהצלחה!');
  }

  changePassword(): void {
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('הסיסמאות לא תואמות');
      return;
    }
    alert('סיסמה שונתה בהצלחה!');
    this.passwordData = { current: '', new: '', confirm: '' };
  }

  toggleTwoFactor(): void {
    this.user.twoFactorEnabled = !this.user.twoFactorEnabled;
    alert(this.user.twoFactorEnabled ? 'אימות דו-שלבי הופעל' : 'אימות דו-שלבי בוטל');
  }

  logoutSession(sessionId: number): void {
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
    alert('הפעלה סגורה בהצלחה');
  }

  saveNotifications(): void {
    alert('העדפות התראות נשמרו בהצלחה!');
  }

  savePreferences(): void {
    alert('העדפות נשמרו בהצלחה!');
  }

  requestAccountDeletion(): void {
    if (confirm('האם אתה בטוח? פעולה זו לא ניתן לביטול!')) {
      alert('בקשת מחיקת חשבון נשלחה. אישור יישלח לדוא"ל שלך');
    }
  }

  logoutFromAllDevices(): void {
    if (confirm('התחברות מכל המכשירים? יהיה עליך להתחבר שוב')) {
      alert('התחברת מכל המכשירים');
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}