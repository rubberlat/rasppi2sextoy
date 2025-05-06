export const styles = {
    container: "flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto",
    title: "text-2xl font-bold mb-4 text-gray-800",
    refreshButton: "flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium",
    errorContainer: "w-full mb-4 p-3 bg-red-100 text-red-700 rounded",
    successContainer: "w-full mb-4 p-3 bg-green-100 text-green-700 rounded",
    controlPanel: "w-full mb-6 bg-white p-6 rounded-lg shadow",
    flexRow: "flex items-center mb-4",
    iconContainer: "flex-shrink-0 mr-4",
    contentContainer: "flex-grow",
    headerRow: "text-lg font-semibold mb-1 flex justify-between",
    valueLabel: "font-mono",
    sliderContainer: "flex items-center",
    sliderLabel: "text-sm mr-2 w-8 text-right",
    slider: "flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
    visualizer: "relative h-20 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden",
    buttonRow: "flex justify-between mt-4",
    presetButton: {
      stop: "px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm",
      low: "px-3 py-1 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 text-sm",
      medium: "px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm",
      high: "px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm"
    },
    vibeWaveContainer: "relative w-full h-12",
    vibeWave: "absolute bottom-0 rounded-t-sm",
    vibeLine: "absolute bottom-0 w-full h-1 bg-gray-300",
    deviceAnimation: "flex justify-center my-4",
    deviceContainer: "w-12 h-20 bg-gray-300 rounded-md",
    deviceScreen: "w-full h-full flex items-center justify-center",
    deviceInner: "w-6 h-10 bg-white rounded opacity-80",
    horizontalContainer: `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center; /* 子要素を縦方向で中央揃え */
        gap: 16px; /* コンポーネント間の間隔 */
        width: 100%; /* 親コンテナの幅を指定 */
    `
    };
  
  // アニメーションCSSスタイル
  export const animationCSS = `
    @keyframes vibrate {
        0% { transform: translateX(-2px); }
        25% { transform: translateX(0); }
        50% { transform: translateX(2px); }
        75% { transform: translateX(0); }
        100% { transform: translateX(-2px); }
    }

    @keyframes pulse {
        0% { transform: scaleY(1); }
        50% { transform: scaleY(1.2); }
        100% { transform: scaleY(1); }
    }

    .vibrating {
        animation-name: vibrate;
        animation-duration: 0.3s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }

    .pulsing {
        animation-name: pulse;
        animation-duration: 0.5s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }

    .wave-container {
      display: flex;
      align-items: flex-end;
      height: 60px;
      width: 100%;
      padding: 0 4px;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .wave-bars-wrapper {
      position: relative;
      width: 320px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      align-items: flex-end;
    }
    
    .wave-bar {
      background-color: #f97316;
      width: 4px;
      margin: 0 2px;
      border-radius: 2px 2px 0 0;
      transition: height 0.2s ease;
      position: absolute;
      bottom: 0;
    }
  `;
  