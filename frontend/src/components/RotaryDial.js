  import React from 'react';
  import { styles } from './styles';
  
  export const RotaryDial = ({ value, color }) => {
    return (
      <div className={styles.visualizer}>
        <div className={styles.dialContainer}>
          <div className={styles.dialInner}>
            {/* 中心点 */}
            <div className={styles.dialCenter}></div>
            
            {/* 回転インジケーター */}
            <div 
              className={styles.dialNeedle}
              style={{ 
                transform: `translate(-50%, -100%) rotate(${value * 1.8}deg)`,
                backgroundColor: color,
                transition: 'transform 0.3s ease-out, background-color 0.3s'
              }}
            ></div>
            
            {/* 背景の目盛り円 */}
            <div className={styles.dialCircle}></div>
          </div>
        </div>
      </div>
    );
  };
