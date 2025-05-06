import React from 'react';
import { RefreshCw } from 'lucide-react';
import { styles, animationCSS } from './styles';
import { IconFallback } from './IconFallback';
import { RotationMotorControl } from './RotationMotorControl';
import { useMotor } from '../contexts/MotorContext';
import { VibrationMotorControl } from './VibrationMotorControl';

function MotorDiagnostics() {
    // モーターコンテキストからデータと関数を取得
    const { 
        motorValues, 
        loading, 
        errors, 
        updateSuccess, 
        updateMotorValue, 
        refreshMotorStatus 
    } = useMotor();
  
    // アイコンコンポーネントの選択
    const RefreshCwIcon = RefreshCw || (props => <IconFallback name="refresh-cw" {...props} />);

    return (
        <div className={styles.container}>
            {/* インラインスタイル用のCSS */}
            <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
            
            <h1 className={styles.title}>モーター制御 パネル</h1>
            
            <div className={styles.horizontalContainer}>
                {/* 左モーターコントロール */}
                <div style={{ flexGrow: 1 }}>
                    <RotationMotorControl
                        deviceName="moter_l"
                        value={motorValues.moter_l}
                        title="左回転モーター"
                        onValueChange={updateMotorValue}
                        disabled={loading}
                    />
                </div>
                
                <div style={{ flexGrow: 1 }}>
                    {/* 右モーターコントロール */}
                    <RotationMotorControl
                        deviceName="moter_r"
                        value={motorValues.moter_r}
                        title="右回転モーター"
                        onValueChange={updateMotorValue}
                        disabled={loading}
                    />
                </div>
            </div>

            {/* バイブレーション制御コンポーネント */}
            <VibrationMotorControl
                deviceName="vibe"
                value={motorValues.vibe}
                title="バイブレーション強度"
                onValueChange={updateMotorValue}
                disabled={loading}
            />

            {/* 必要に応じて他のモーターコントロールも追加可能 */}
        </div>
    );
}

export default MotorDiagnostics;
