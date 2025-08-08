/**
 * Main app container component
 */

import React from 'react';

const AppContainer = ({ children }) => {
  return (
    <div className="app-container">
      {children}
      
      <style jsx>{`
        .app-container {
          max-width: 500px;
          margin: 0 auto;
          min-height: 100vh;
          min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        @media (max-width: 480px) {
          .app-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AppContainer;
