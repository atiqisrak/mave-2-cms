import { ProfileForm } from '@/components/user/profile-form';
import { UserInfo } from '@/components/user/user-info';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <UserInfo />
        </div>
      </div>
    </div>
  );
}
