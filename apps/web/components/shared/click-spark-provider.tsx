'use client';

import ClickSpark from '@/components/ui/click-spark';
import CustomCursor from '@/components/shared/custom-cursor';

export default function ClickSparkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark
      sparkColor="#111"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <CustomCursor />
      {children}
    </ClickSpark>
  );
}
