import { InviteAcceptanceForm } from '@/components/auth/invite-acceptance-form';

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default function InvitePage({ params }: InvitePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <InviteAcceptanceForm token={params.token} />
      </div>
    </div>
  );
}
