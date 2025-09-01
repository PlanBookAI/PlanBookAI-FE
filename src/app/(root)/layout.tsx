import { TurnstileProvider } from '@/components/providers/TurnstileProvider';
import { GlobalTurnstile } from '@/components/ui/GlobalTurnstile';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TurnstileProvider>
      {children}
      <GlobalTurnstile />
    </TurnstileProvider>
  );
}
