export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  neighborhood?: string;
  joinedAt: string;
  totalPoints: number;
  challengesCompleted: number;
  surveysCompleted: number;
}
