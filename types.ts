
export type Category = 'Telecalling' | 'Web Development' | 'Blogs' | 'Social Media' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'member';
  category: Category;
  password?: string;
}

export const TEAM_MEMBERS: User[] = [
  { id: 'vishakha', name: 'Vishakha', role: 'member', category: 'Telecalling', password: 'vishakha123' },
  { id: 'devanshi', name: 'Devanshi', role: 'member', category: 'Telecalling', password: 'devanshi123' },
  { id: 'ayushi', name: 'Ayushi', role: 'member', category: 'Web Development', password: 'ayushi123' },
  { id: 'dishant', name: 'Dishant', role: 'member', category: 'Blogs', password: 'dishant123' },
  { id: 'akash', name: 'Akash', role: 'member', category: 'Blogs', password: 'akash123' },
  { id: 'me', name: 'Me', role: 'admin', category: 'Social Media', password: 'admin123' },
];

export interface TaskLog {
  id: string;
  timestamp: string;
  category: Category;
  teamMemberId: string;
  teamMemberName: string;
  taskDescription: string;
  status: 'Completed' | 'In Progress' | 'Blocked';
  metricValue: number;
  comments?: string;
}

export interface Assignment {
  id: string;
  adminId: string;
  targetUserId: string;
  targetUserName: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  status: 'Pending' | 'Acknowledged' | 'In Progress' | 'Done';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export type View = 'dashboard' | 'logs' | 'directives' | 'chat' | 'gas-config';

export interface AnalysisResult {
  summary: string;
  productivityGaps: string[];
  recommendations: string[];
}
