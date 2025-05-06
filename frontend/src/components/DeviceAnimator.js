import React from 'react';
import { styles } from './styles';
import { getVibrationSpeed } from '../utils/motorUtils';

export const DeviceAnimator = ({ value }) => {
  return (
    <div className={styles.deviceAnimation}>
      <div 
        className={`${styles.deviceContainer} ${value > 0 ? "vibrating" : ""}`}
        style={{ 
          animationDuration: getVibrationSpeed(value),
          backgroundColor: value > 0 ? '#d1d5db' : '#d1d5db',
          boxShadow: value > 0 ? '0 0 8px rgba(249, 115, 22, 0.5)' : 'none'
        }}
      >
        <div className={styles.deviceScreen}>
          <div className={styles.deviceInner}></div>
        </div>
      </div>
    </div>
  );
};
