'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React from 'react';

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
      return (
            <>
                  {children}
                  <ProgressBar
                        height="3px"
                        color="#1684faff"
                        options={{ showSpinner: false }}
                        shallowRouting
                  />
            </>
      );
};

export default NProgressWrapper;