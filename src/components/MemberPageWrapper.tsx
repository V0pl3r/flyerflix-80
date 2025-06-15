
import { ReactNode } from 'react';
import MemberLayout from './MemberLayout';

interface MemberPageWrapperProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
}

const MemberPageWrapper = ({ children, showWelcomeMessage = false }: MemberPageWrapperProps) => {
  return (
    <MemberLayout showWelcomeMessage={showWelcomeMessage}>
      {children}
    </MemberLayout>
  );
};

export default MemberPageWrapper;
