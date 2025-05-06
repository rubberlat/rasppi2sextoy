import React from 'react';
import { Vibrate } from 'lucide-react';
import { styles, animationCSS } from './styles';
import { IconFallback } from './IconFallback';
import { WaveVisualizer } from './WaveVisualizer';
import { DeviceAnimator } from './DeviceAnimator';
import { useMotor } from '../contexts/MotorContext';
import { getVibrationColor, getVibrationSpeed, getSliderBackground } from '../utils/motorUtils';

export function VibrationMotorControl() {
    // モーターコンテキストからデータと関数を取得
    const {
        motorValues,
        loading,
        updateMotorValue
    } = useMotor();

    // アイコンコンポーネントの選択
    const VibrateIcon = Vibrate || (props => <IconFallback name="vibrate" {...props} />);

    return (
        <div className={styles.container}>
            {/* インラインスタイル用のCSS */}
            <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
            
            <h1 className={styles.title}>バイブレーション制御 パネル</h1>
            
            <div className={styles.controlPanel}>
                <div className={styles.flexRow}>
                    <div className={styles.iconContainer}>
                        <VibrateIcon
                            size={32}
                            color={getVibrationColor(motorValues.vibe)}
                            className={motorValues.vibe > 0 ? "vibrating" : ""}
                            style={{
                                animationDuration: getVibrationSpeed(motorValues.vibe)
                            }}
                        />
                    </div>
                    <div className={styles.contentContainer}>
                        <h2 className={styles.headerRow}>
                            <span>バイブレーション強度</span>
                            <span className={styles.valueLabel}>{motorValues.vibe}</span>
                        </h2>
                        <div className={styles.sliderContainer}>
                            <span className={styles.sliderLabel}>0</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={motorValues.vibe}
                                onChange={(e) => updateMotorValue("vibe", parseInt(e.target.value))}
                                className={styles.slider}
                                disabled={loading}
                                style={{
                                    WebkitAppearance: 'none',
                                    appearance: 'none',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: getSliderBackground(motorValues.vibe, getVibrationColor)
                                }}
                            />
                            <span className={styles.sliderLabel}>100</span>
                        </div>
                    </div>
                </div>

                {/* バイブレーション視覚化 */}
                <div className={styles.visualizer}>
                    <WaveVisualizer value={motorValues.vibe} />
                </div>

                {/* デバイスアニメーション */}
                <DeviceAnimator value={motorValues.vibe} />

                {/* プリセットボタン */}
                <div className={styles.buttonRow}>
                    <button
                        onClick={() => updateMotorValue("vibe", 0)}
                        className={styles.presetButton.stop}
                        disabled={loading}
                    >
                        停止
                    </button>
                    <button
                        onClick={() => updateMotorValue("vibe", 25)}
                        className={styles.presetButton.low}
                        disabled={loading}
                    >
                        弱
                    </button>
                    <button
                        onClick={() => updateMotorValue("vibe", 50)}
                        className={styles.presetButton.medium}
                        disabled={loading}
                    >
                        中
                    </button>
                    <button
                        onClick={() => updateMotorValue("vibe", 100)}
                        className={styles.presetButton.high}
                        disabled={loading}
                    >
                        強
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VibrationMotorControl;
