import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditLog {
  id: number;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  actionLabel: string;
  resource: string;
  resourceId: string;
  status: 'success' | 'failed';
  ipAddress: string;
  details: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.logs.html',
  styleUrl: './audit.logs.css',
})
export class AuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  
  searchTerm: string = '';
  filterAction: string = 'all';
  filterStatus: string = 'all';

  ngOnInit(): void {
    this.loadDemoData();
    this.applyFilters();
  }

  private loadDemoData(): void {
    this.auditLogs = [
      {
        id: 1,
        timestamp: new Date('2024-01-12T14:32:00'),
        userId: 'USER001',
        userName: 'יוסף נגה',
        action: 'CREATE',
        actionLabel: 'הוסף עובד חדש',
        resource: 'עובד',
        resourceId: 'EMP-2024-001',
        status: 'success',
        ipAddress: '192.168.1.45',
        details: 'יצר פרופיל עובד חדש - דוד לי',
      },
      {
        id: 2,
        timestamp: new Date('2024-01-12T13:15:00'),
        userId: 'USER002',
        userName: 'שרה כהן',
        action: 'UPDATE',
        actionLabel: 'עדכן פרטי משכורת',
        resource: 'משכורת',
        resourceId: 'DEPT-003',
        status: 'success',
        ipAddress: '192.168.1.78',
        details: 'עדכן הקצאת תקציב מחלקה',
      },
      {
        id: 3,
        timestamp: new Date('2024-01-12T12:45:00'),
        userId: 'USER003',
        userName: 'רוני שפירו',
        action: 'DELETE',
        actionLabel: 'מחק בקשת חופש',
        resource: 'בקשת חופש',
        resourceId: 'LEAVE-567',
        status: 'failed',
        ipAddress: '192.168.1.23',
        details: 'נסיון לא מורשה למחוק בקשת חופש מאושרת',
      },
      {
        id: 4,
        timestamp: new Date('2024-01-12T11:20:00'),
        userId: 'USER001',
        userName: 'יוסף נגה',
        action: 'VIEW',
        actionLabel: 'הצג דוח משכורות',
        resource: 'משכורות',
        resourceId: 'PAYROLL-Q4-2023',
        status: 'success',
        ipAddress: '192.168.1.45',
        details: 'גישה לדוח משכורות Q4 2023',
      },
      {
        id: 5,
        timestamp: new Date('2024-01-12T10:30:00'),
        userId: 'USER004',
        userName: 'מיכאל בן דוד',
        action: 'EXPORT',
        actionLabel: 'ייצא רשימת עובדים',
        resource: 'נתוני עובדים',
        resourceId: 'EMP-LIST-2024',
        status: 'success',
        ipAddress: '192.168.1.67',
        details: 'ייצא רשימה של כל העובדים ל-CSV',
      },
      {
        id: 6,
        timestamp: new Date('2024-01-12T09:15:00'),
        userId: 'USER002',
        userName: 'שרה כהן',
        action: 'LOGIN',
        actionLabel: 'התחבר למערכת',
        resource: 'מערכת',
        resourceId: 'AUTH-001',
        status: 'success',
        ipAddress: '192.168.1.78',
        details: 'המשתמש התחבר בהצלחה',
      },
      {
        id: 7,
        timestamp: new Date('2024-01-12T08:45:00'),
        userId: 'USER005',
        userName: 'ליזה אברהם',
        action: 'UPDATE',
        actionLabel: 'עדכן משכורת עובד',
        resource: 'עובד',
        resourceId: 'EMP-2023-456',
        status: 'success',
        ipAddress: '192.168.1.34',
        details: 'עדכן מידע משכורת של עובד',
      },
      {
        id: 8,
        timestamp: new Date('2024-01-11T17:30:00'),
        userId: 'USER003',
        userName: 'רוני שפירו',
        action: 'CREATE',
        actionLabel: 'צור דוח ביצוע',
        resource: 'דוח ביצוע',
        resourceId: 'PERF-789',
        status: 'success',
        ipAddress: '192.168.1.23',
        details: 'יצר דוח ביצוע חדש ל-Q1 2024',
      },
      {
        id: 9,
        timestamp: new Date('2024-01-11T16:00:00'),
        userId: 'USER001',
        userName: 'יוסף נגה',
        action: 'VIEW',
        actionLabel: 'הצג הרשאות משתמשים',
        resource: 'הרשאות',
        resourceId: 'USER-PERM-001',
        status: 'success',
        ipAddress: '192.168.1.45',
        details: 'גישה להגדרות הרשאות משתמש',
      },
      {
        id: 10,
        timestamp: new Date('2024-01-11T14:45:00'),
        userId: 'USER004',
        userName: 'מיכאל בן דוד',
        action: 'LOGIN',
        actionLabel: 'נסיון התחברות כושל',
        resource: 'מערכת',
        resourceId: 'AUTH-002',
        status: 'failed',
        ipAddress: '192.168.1.99',
        details: 'נסיון התחברות נכשל - פרטים שגויים',
      },
      {
        id: 11,
        timestamp: new Date('2024-01-11T13:30:00'),
        userId: 'USER002',
        userName: 'שרה כהן',
        action: 'DELETE',
        actionLabel: 'מחק מסמך',
        resource: 'מסמך',
        resourceId: 'DOC-234',
        status: 'success',
        ipAddress: '192.168.1.78',
        details: 'מחק מסמך HR ישן',
      },
      {
        id: 12,
        timestamp: new Date('2024-01-11T12:15:00'),
        userId: 'USER005',
        userName: 'ליזה אברהם',
        action: 'EXPORT',
        actionLabel: 'ייצא רישום נוכחות',
        resource: 'רישומי נוכחות',
        resourceId: 'ATTEND-2024',
        status: 'success',
        ipAddress: '192.168.1.34',
        details: 'ייצא רישומי נוכחות לינואר',
      },
    ];
  }

  applyFilters(): void {
    this.filteredLogs = this.auditLogs.filter((log) => {
      const matchesSearch =
        this.searchTerm === '' ||
        log.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesAction =
        this.filterAction === 'all' || log.action === this.filterAction;

      const matchesStatus =
        this.filterStatus === 'all' || log.status === this.filterStatus;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }

  getActionClass(action: string): string {
    const actionMap: Record<string, string> = {
      CREATE: 'action-create',
      UPDATE: 'action-update',
      DELETE: 'action-delete',
      VIEW: 'action-view',
      EXPORT: 'action-export',
      LOGIN: 'action-login',
    };
    return actionMap[action] || 'action-default';
  }

  getActionIcon(action: string): string {
    const iconMap: Record<string, string> = {
      CREATE: '➕',
      UPDATE: '✎',
      DELETE: '🗑️',
      VIEW: '👁',
      EXPORT: '⬇',
      LOGIN: '🔓',
    };
    return iconMap[action] || '•';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}