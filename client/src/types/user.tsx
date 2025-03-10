export interface UserInfos {
  id: number;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  createdAt: string;
  notification: string;
  statut: string;
}

export interface HandleUserStatusChangedProps {
  userId: number;
  statut: string;
}