import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Clock, RotateCw, Play, Pause, ChevronDown, ChevronUp, Grip } from 'lucide-react';
import { RotationMotorControl } from './RotationMotorControl';
import { VibrationMotorControl } from './VibrationMotorControl';


// モダンなカラーパレット
const theme = {
  primary: '#6366f1', // インディゴ
  primaryDark: '#4f46e5',
  primaryLight: '#a5b4fc',
  secondary: '#f43f5e', // ローズ
  background: '#f9fafb',
  backgroundAlt: '#ffffff',
  gray: '#f3f4f6',
  grayDark: '#9ca3af',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  danger: '#ef4444',
};

// スタイリッシュなスライダーと入力のデザイン
const modernStyles = {
  container: {
    backgroundColor: theme.background,
    minHeight: '100vh',
    paddingBottom: '100px',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.backgroundAlt,
    borderBottom: `1px solid ${theme.border}`,
    zIndex: 10,
    padding: '16px',
  },
  card: {
    backgroundColor: theme.backgroundAlt,
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
  },
  rangeInput: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: theme.border,
    outline: 'none',
    opacity: '0.9',
    transition: 'opacity 0.2s',
  },
  rangeThumb: {
    WebkitAppearance: 'none',
    appearance: 'none',
    height: '18px',
    width: '18px',
    borderRadius: '50%',
    background: theme.primary,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  activeItem: {
    backgroundColor: '#f0f7ff',
    borderLeft: `4px solid ${theme.primary}`,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
  },
  playButton: {
    backgroundColor: theme.success,
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  stopButton: {
    backgroundColor: theme.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  addButton: {
    backgroundColor: theme.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.2s ease',
  },
  progressBar: {
    backgroundColor: theme.border,
    borderRadius: '8px',
    height: '10px',
    overflow: 'hidden',
  },
  progress: (value) => ({
    height: '100%',
    width: `${value}%`,
    backgroundColor: theme.primary,
    borderRadius: '8px',
    transition: 'width 0.3s ease',
  }),
  timeDisplay: {
    backgroundColor: theme.gray,
    borderRadius: '16px',
    padding: '4px 10px',
    fontSize: '14px',
    color: theme.textLight,
    display: 'inline-flex',
    alignItems: 'center',
  },
  dragging: {
    opacity: 0.6,
    transform: 'scale(1.02)',
  },
  dropTarget: {
    borderTop: `2px dashed ${theme.primaryLight}`,
  },
};

// スライダーの背景グラデーション
const getSliderGradient = (value) => {
    return {
        background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${value}%, ${theme.border} ${value}%, ${theme.border} 100%)`,
    };
};

// タイムラインアイテムコンポーネント（モダンデザイン）
const TimelineItem = ({ item, index, onRemove, onDurationChange, isActive, onDragStart, onDragOver, onDrop }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const itemRef = useRef(null);
    
    const handleDragStart = (e) => {
        onDragStart(index);
        if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        setTimeout(() => {
            if (itemRef.current) {
            Object.assign(itemRef.current.style, modernStyles.dragging);
            }
        }, 0);
        }
    };
    
    const handleDragEnd = () => {
        if (itemRef.current) {
        itemRef.current.style.opacity = '1';
        itemRef.current.style.transform = 'scale(1)';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        onDragOver(index);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        onDrop(index);
        if (itemRef.current) {
        itemRef.current.style.opacity = '1';
        itemRef.current.style.transform = 'scale(1)';
        }
    };
    const { 
        motorValues, 
        loading, 
        errors, 
        updateSuccess, 
        updateMotorValue, 
        refreshMotorStatus 
    } = useMotor();

    return (
        <div 
        ref={itemRef}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mb-3 overflow-hidden ${isActive ? '' : ''}`}
        style={{
            ...modernStyles.card,
            ...(isActive ? modernStyles.activeItem : {}),
            transition: 'all 0.3s ease',
        }}
        >
        <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            <div className="flex items-center">
            <div className="mr-3 text-gray-400 cursor-grab">
                <Grip size={18} />
            </div>
            <RotationMotorControl
                deviceName="moter_l"
                value={motorValues.moter_l}
                title="左回転モーター"
                onValueChange={updateMotorValue}
                disabled={loading}
            />

            <div>
                <div className="font-medium">{`パワー: ${item.power}%`}</div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                <Clock size={14} className="mr-1" />{item.duration}秒
                </div>
            </div>
            </div>
            
            <div className="flex items-center">
            {isActive && (
                <div className="mr-2 py-1 px-3 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                実行中
                </div>
            )}
            <button 
                onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
                }} 
                className="ml-2 text-gray-400 hover:text-red-500 p-1"
            >
                <X size={18} />
            </button>
            <button className="ml-1 text-gray-400">
                {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            </div>
        </div>
        
        {!isCollapsed && (
            <div className="px-4 pb-4 pt-1">
            <div className="mb-4">
                <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                    パワー
                </label>
                <span className="text-sm font-bold text-gray-900">{item.power}%</span>
                </div>
                <input
                type="range"
                min="0"
                max="100"
                value={item.power}
                onChange={(e) => onDurationChange(item.id, 'power', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                    ...modernStyles.rangeInput,
                    ...getSliderGradient(item.power),
                }}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                継続時間（秒）
                </label>
                <div className="flex items-center">
                <button 
                    onClick={() => onDurationChange(item.id, 'duration', Math.max(0.5, item.duration - 0.5))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-lg text-gray-700 font-bold"
                >
                    -
                </button>
                <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={item.duration}
                    onChange={(e) => onDurationChange(item.id, 'duration', parseFloat(e.target.value))}
                    className="h-10 text-center border-y border-gray-200 w-16 text-gray-700 focus:outline-none focus:border-indigo-300"
                />
                <button 
                    onClick={() => onDurationChange(item.id, 'duration', item.duration + 0.5)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-lg text-gray-700 font-bold"
                >
                    +
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

// モダン版のメインタイムラインコンポーネント
const ModernMotorControlTimeline = () => {
    const [items, setItems] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(-1);
    const [remainingTime, setRemainingTime] = useState(0);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [dropTargetIndex, setDropTargetIndex] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);
  
    // 全体の継続時間を計算
    useEffect(() => {
        const total = items.reduce((acc, item) => acc + item.duration, 0);
        setTotalDuration(total);
    }, [items]);
  
    // タイムラインアイテムの追加
    const addItem = () => {
        const newItem = {
        id: `item-${Date.now()}`,
        power: 50,
        duration: 2,
        };
        setItems([...items, newItem]);
    };
  
    // タイムラインアイテムの削除
    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };
  
    // タイムラインアイテムの値変更
    const handleItemChange = (id, property, value) => {
        setItems(items.map(item => 
        item.id === id ? { ...item, [property]: value } : item
        ));
    };
  
    // ドラッグ開始時の処理
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };
  
    // ドラッグ中の処理
    const handleDragOver = (index) => {
        setDropTargetIndex(index);
    };
  
    // ドロップ時の処理
    const handleDrop = (dropIndex) => {
        if (draggedItemIndex !== null && dropIndex !== null && draggedItemIndex !== dropIndex) {
            const newItems = [...items];
            const draggedItem = newItems[draggedItemIndex];
            
            // 要素を削除してから挿入
            newItems.splice(draggedItemIndex, 1);
            newItems.splice(dropIndex, 0, draggedItem);
            
            setItems(newItems);
        }

        // リセット
        setDraggedItemIndex(null);
        setDropTargetIndex(null);
    };
  
    // 再生/停止の切り替え
    const togglePlayback = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            if (items.length > 0) {
            setIsPlaying(true);
            setCurrentItemIndex(0);
            setRemainingTime(items[0].duration);
            }
        }
    };
  
    // タイムライン再生の管理
    useEffect(() => {
        let timer;
        if (isPlaying && currentItemIndex < items.length) {
            timer = setInterval(() => {
            setRemainingTime(prev => {
                const newTime = prev - 0.1;
                if (newTime <= 0) {
                // 次のアイテムへ
                const nextIndex = currentItemIndex + 1;
                if (nextIndex < items.length) {
                    setCurrentItemIndex(nextIndex);
                    return items[nextIndex].duration;
                } else {
                    // 全アイテム再生終了
                    setIsPlaying(false);
                    setCurrentItemIndex(-1);
                    return 0;
                }
                }
                return newTime;
            });
            }, 100);
        }

        return () => clearInterval(timer);
    }, [isPlaying, currentItemIndex, items]);
  
    // 現在の進行状況の割合を計算
    const calculateProgress = () => {
        if (items.length === 0 || currentItemIndex === -1) return 0;
        
        const completedDuration = items.slice(0, currentItemIndex).reduce((acc, item) => acc + item.duration, 0);
        const currentElapsed = items[currentItemIndex].duration - remainingTime;
        
        return ((completedDuration + currentElapsed) / totalDuration) * 100;
    };
  
    return (
        <div style={modernStyles.container}>
        <div style={modernStyles.header}>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">モーター制御タイムライン</h1>
            
            {/* 全体の進行状況バー */}
            {isPlaying && (
            <div className="mb-3" style={modernStyles.progressBar}>
                <div style={modernStyles.progress(calculateProgress())}></div>
            </div>
            )}
            
            {/* 再生コントロール */}
            <div className="flex items-center justify-between py-2">
            <button 
                onClick={togglePlayback}
                style={isPlaying ? modernStyles.stopButton : modernStyles.playButton}
                className="transition-all hover:brightness-105 active:scale-95"
            >
                {isPlaying ? <><Pause size={18} className="mr-2" /> 停止</> : <><Play size={18} className="mr-2" /> 再生</>}
            </button>
            
            <div className="flex items-center">
                {isPlaying && currentItemIndex >= 0 && (
                <div style={modernStyles.timeDisplay}>
                    <Clock size={14} className="mr-1" />
                    <span>{remainingTime.toFixed(1)}秒</span>
                </div>
                )}
                
                {totalDuration > 0 && (
                <div className="ml-2 text-sm text-gray-500">
                    合計: {totalDuration.toFixed(1)}秒
                </div>
                )}
                
                {isPlaying && (
                <button 
                    onClick={() => {
                    setIsPlaying(false);
                    setCurrentItemIndex(-1);
                    }}
                    className="ml-3 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full"
                >
                    <RotateCw size={16} />
                </button>
                )}
            </div>
            </div>
        </div>
        
        <div className="p-4">
            {/* タイムラインアイテムのリスト */}
            <div className="mb-4 mt-4">
            {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                タイムラインにアイテムがありません。<br />
                「新しいモーター設定を追加」ボタンをクリックして開始してください。
                </div>
            ) : (
                items.map((item, index) => (
                <TimelineItem
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={removeItem}
                    onDurationChange={handleItemChange}
                    isActive={index === currentItemIndex && isPlaying}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
                ))
            )}
            </div>
            
            {/* 新規アイテム追加ボタン - 画面下部に固定 */}
            <div className="fixed bottom-4 left-0 right-0 px-4">
            <button
                onClick={addItem}
                style={modernStyles.addButton}
                className="w-full transition-all hover:brightness-105 active:scale-98"
            >
                <Plus size={20} className="mr-2" /> 新しいモーター設定を追加
            </button>
            </div>
            
            {/* 現在の出力表示 */}
            {isPlaying && currentItemIndex >= 0 && (
            <div className="mb-20 mt-6 p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-medium mb-3">現在の出力</h2>
                <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden relative">
                <div 
                    className="h-full rounded-full flex items-center justify-end pr-2 text-white font-bold"
                    style={{
                    width: `${items[currentItemIndex].power}%`,
                    backgroundColor: theme.primary,
                    transition: 'width 0.3s ease',
                    }}
                >
                    {items[currentItemIndex].power > 10 ? `${items[currentItemIndex].power}%` : ''}
                </div>
                {items[currentItemIndex].power <= 10 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">
                    {items[currentItemIndex].power}%
                    </div>
                )}
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default ModernMotorControlTimeline;
