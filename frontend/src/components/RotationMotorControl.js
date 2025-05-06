import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { styles } from './styles';
import { IconFallback } from './IconFallback';
import { RotaryDial } from './RotaryDial';
import { getRotationColor, getRotationSpeed } from '../utils/motorUtils';

export const RotationMotorControl = ({ 
  deviceName,  // モーターのデバイス名
  value,       // 現在の値
  title,       // 表示タイトル
  onValueChange,  // 値が変更された時のコールバック
  disabled     // 無効状態
}) => {
  // アイコンコンポーネントの選択（lucide-reactの有無で分岐）
  const RotateCcwIcon = RotateCcw || (props => <IconFallback name="rotate-ccw" {...props} />);
  const RotateCwIcon = RotateCw || (props => <IconFallback name="rotate-cw" {...props} />);
  
  // 回転方向に基づくアイコンの選択
  const RotationIcon = value < 0 ? RotateCcwIcon : RotateCwIcon;
  
  // 回転色の計算
  const rotationColor = getRotationColor(value);
  
  // 回転スピードの計算
  const rotationSpeed = getRotationSpeed(value);
  
  return (
    <div className={styles.controlPanel}>
      <div className={styles.flexRow}>
        <div className={styles.iconContainer}>
          <RotationIcon 
            size={32} 
            color={rotationColor} 
            className="animate-spin" 
            style={{ 
              animationDuration: value !== 0 ? `${1/rotationSpeed}s` : '0s',
              animationPlayState: value !== 0 ? 'running' : 'paused' 
            }} 
          />
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.headerRow}>
            <span>{title}</span>
            <span className={styles.valueLabel}>{value}</span>
          </h2>
          <div className={styles.sliderContainer}>
            <span className={styles.sliderLabel}>-100</span>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              value={value} 
              onChange={(e) => onValueChange(deviceName, parseInt(e.target.value))}
              className={styles.slider}
              disabled={disabled}
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
                height: '8px',
                borderRadius: '4px',
                background: rotationColor
              }}
            />
            <span className={styles.sliderLabel}>100</span>
          </div>
        </div>
      </div>
      
      {/* 回転方向と強度のビジュアル表示 */}
      <RotaryDial value={value} color={rotationColor} />
      
      {/* プリセットボタン */}
      <div className={styles.buttonRow}>
        <button 
          onClick={() => onValueChange(deviceName, -100)}
          className={styles.presetButton.reverse}
          disabled={disabled}
        >
          最大逆回転
        </button>
        <button 
          onClick={() => onValueChange(deviceName, 0)}
          className={styles.presetButton.stop}
          disabled={disabled}
        >
          停止
        </button>
        <button 
          onClick={() => onValueChange(deviceName, 100)}
          className={styles.presetButton.forward}
          disabled={disabled}
        >
          最大順回転
        </button>
      </div>
    </div>
  );
};
