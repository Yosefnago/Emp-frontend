import { Time } from "@angular/common";

export interface LastActivity {
  id: number;
  fromUser: string;
  action: string;              
  affectedEmployee: string;    
  dateAction: string;          
  timeAction: string;          
}

export interface AuditLog {
  id: number;
  fromUser: string;
  action: string;              
  affectedEmployee: string;    
  dateAction: string;          
  timeAction: string;     
}
