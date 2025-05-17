
import React, { ReactNode } from 'react';

interface MemberPageWrapperProps {
  children: ReactNode;
}

const MemberPageWrapper: React.FC<MemberPageWrapperProps> = ({ children }) => {
  return (
    <div className="container max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default MemberPageWrapper;
