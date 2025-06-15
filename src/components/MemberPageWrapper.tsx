
import { ReactNode } from 'react';
import MemberLayout from './MemberLayout';
import { AuthProvider } from '@/hooks/useAuth';

interface MemberPageWrapperProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
}

const MemberPageWrapper = ({ children, showWelcomeMessage = false }: MemberPageWrapperProps) => {
  return (
    <AuthProvider>
      <MemberLayout showWelcomeMessage={showWelcomeMessage}>
        {children}
      </MemberLayout>
    </AuthProvider>
  );
};

export default MemberPageWrapper;
