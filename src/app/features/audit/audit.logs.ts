import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../core/services/audit-log.service';
import { AuditLog } from '../../core/models/AuditLog';


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

  constructor(private auditLogService: AuditLogService) { }

  ngOnInit(): void {
    this.loadAllLogs();
    this.applyFilters();
  }

  loadAllLogs(): void {
    this.auditLogService.loadAllLogs().subscribe({
      next: (logs: AuditLog[]) => {
        this.auditLogs = logs;
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    this.filteredLogs = this.auditLogs.filter((log) => {
      const matchesSearch =
        this.searchTerm === '' ||
        log.fromUser.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.affectedEmployee.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesAction =
        this.filterAction === 'all' || log.action === this.filterAction;


      return matchesSearch && matchesAction;
    });
  }


  getActivityMessage(item: AuditLog) {
    return this.parseActivityMessage(item);
  }
  parseActivityMessage(activity: AuditLog): { label: string; details: string } {
    const action = activity.action.toUpperCase();
    const affectedEmployee = activity.affectedEmployee || '';

    const actionLabels: { [key: string]: string } = {
      'ADD': 'הוספה',
      'DELETE': 'מחיקה',
      'UPDATE': 'עדכון',
      'ARCHIVE': 'העביר לארכיון',
      'RESTORE': 'שחזור'
    };

    const hebrewAction = actionLabels[action] || action;

    // Return formatted message
    if (affectedEmployee) {
      return {
        label: `${hebrewAction}`,
        details: affectedEmployee
      };
    }

    return {
      label: `${hebrewAction}`,
      details: ''
    };
  }

  formatRelativeTime(date: string, time: string): string {
    const actionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = now.getTime() - actionDateTime.getTime();

    if (diffMs < 0) {
      return 'עכשיו';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'עכשיו';
    }

    if (diffMinutes < 60) {
      if (diffMinutes === 1) {
        return 'לפני דקה';
      }
      if (diffMinutes === 2) {
        return 'לפני שתי דקות';
      }
      return `לפני ${diffMinutes} דקות`;
    }

    if (diffHours < 24) {
      if (diffHours === 1) {
        return 'לפני שעה';
      }
      if (diffHours === 2) {
        return 'לפני שעתיים';
      }
      return `לפני ${diffHours} שעות`;
    }

    if (diffDays < 7) {
      if (diffDays === 1) {
        return 'אתמול';
      }
      if (diffDays === 2) {
        return 'שלשום';
      }
      return `לפני ${diffDays} ימים`;
    }

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      if (weeks === 1) {
        return 'לפני שבוע';
      }
      return `לפני ${weeks} שבועות`;
    }

    const months = Math.floor(diffDays / 30);
    if (months === 1) {
      return 'לפני חודש';
    }
    return `לפני ${months} חודשים`;
  }
}