import React, { useState, useEffect } from 'react';
import { getVibrationColor, getVibrationSpeed } from '../utils/motorUtils';

export const WaveVisualizer = ({ value }) => {
  // 固定された高さと幅
  const CONTAINER_HEIGHT = 60;
  const MAX_BAR_HEIGHT = CONTAINER_HEIGHT * 0.8;
  const FIXED_WIDTH = 320;
  
  // バーのサイズと数の設定
  const BAR_WIDTH = 4;
  const BAR_MARGIN = 2;
  const numBars = 20;

  // 各バーの高さのランダム係数
  const [barHeightFactors, setBarHeightFactors] = useState(() => {
    // 初期値として完全にランダムなパターンを生成
    return Array(numBars).fill(0).map(() => Math.random() * 0.8 + 0.2); // 0.2～1.0のランダム値
  });
  
  // value が変わったときにランダムパターンを更新
  useEffect(() => {
    // 現在のパターンを基に新しいランダムパターンを生成
    const newFactors = barHeightFactors.map(factor => {
      // 前回の値を基準に±30%の範囲内でランダム変化
      const randomChange = 0.7 + (Math.random() * 0.6); // 0.7～1.3のランダム変化率
      const newFactor = factor * randomChange;
      
      // 値の範囲を0.2～1.0に制限（極端に小さすぎたり大きすぎたりしないように）
      return Math.max(0.2, Math.min(1.0, newFactor));
    });
    
    // 隣接するバーとの関係性も考慮（滑らかさをある程度維持）
    const smoothedFactors = newFactors.map((factor, index) => {
      if (index === 0 || index === numBars - 1) return factor; // 端のバーはそのまま
      
      // 隣接するバーの値の影響を受ける（20%は隣のバーの影響、80%は自身のランダム値）
      const leftInfluence = newFactors[index - 1] * 0.1;
      const rightInfluence = newFactors[(index + 1) % numBars] * 0.1;
      const selfInfluence = factor * 0.8;
      
      return leftInfluence + selfInfluence + rightInfluence;
    });
    
    setBarHeightFactors(smoothedFactors);
  }, [value]); // valueが変わるたびに実行
  
  const bars = [];
  
  // 固定幅の中でバーを配置
  const spacing = FIXED_WIDTH / numBars; // 均等に配置するための間隔
  
  for (let i = 0; i < numBars; i++) {
    // ランダムな波形パターンを使用
    const randomPattern = barHeightFactors[i];
    
    // 振動値が0の場合は最小値、それ以外は計算した値を使用
    const heightPx = value === 0 
      ? 2 // 最小高さ（ほぼフラット）
      : Math.max(2, randomPattern * (value / 100) * MAX_BAR_HEIGHT);
    
    // アニメーションディレイもランダムに
    const animationDelay = `${Math.random() * 0.5}s`;
    
    // バーの左位置を計算（px単位 - 固定幅内での絶対位置）
    const leftPosition = (i * spacing) + ((spacing - BAR_WIDTH) / 2);
    
    bars.push(
      <div 
        key={i} 
        style={{
          height: `${heightPx}px`, // ピクセル単位で高さを指定
          left: `${leftPosition}px`, // ピクセル単位で位置を指定
          backgroundColor: getVibrationColor(value),
          animationDelay: animationDelay,
          animationName: value > 0 ? 'pulse' : 'none',
          animationDuration: value > 0 ? '0.5s' : '0s',
          animationIterationCount: value > 0 ? 'infinite' : '1',
          opacity: value === 0 ? 0.3 : 1,
          width: `${BAR_WIDTH}px`
        }}
        className="wave-bar"
      />
    );
  }
  
  return (
    <div className="wave-container">
      <div className="wave-bars-wrapper">
        {bars}
      </div>
    </div>
  );
};
