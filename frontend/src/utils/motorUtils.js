/**
 * 回転方向と強度を示す色を計算（回転モーター用）
 */
export const getRotationColor = (value) => {
    if (value > 0) return `rgb(0, ${Math.min(200, value * 2)}, 0)`; // 順方向は緑系
    if (value < 0) return `rgb(${Math.min(200, Math.abs(value) * 2)}, 0, 0)`; // 逆方向は赤系
    return '#888'; // 停止中はグレー
};
  
/**
 * バイブレーション強度を示す色を計算
 */
export const getVibrationColor = (value) => {
    return `rgb(${Math.min(255, value * 2.5)}, ${Math.min(150, value * 1.5)}, 0)`;
};
  
/**
 * 回転アニメーションのスピードを計算
 */
export const getRotationSpeed = (value) => {
    const absValue = Math.abs(value);
    if (absValue === 0) return 0;
    return absValue / 20;
};

/**
 * バイブレーション強度に基づいてアニメーション速度を計算
 */
export const getVibrationSpeed = (value) => {
    if (value === 0) return '0s';
    // 値が大きいほど、アニメーションが速くなる（小さい秒数になる）
    return `${0.3 - (value / 500)}s`;
};
  
/**
 * スライダーの背景色のグラデーションを計算
 */
export const getSliderBackground = (value, colorFn) => {
    const color = colorFn(value);
    return `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`;
};

