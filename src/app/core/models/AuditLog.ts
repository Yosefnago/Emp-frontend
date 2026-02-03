export interface AuditLog {
  id: number;
  fromUser: string;
  action: string;              
  affectedEmployee: string;    
  dateAction: string;          
  timeAction: string;     
}