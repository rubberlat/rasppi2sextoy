/*
状態管理層 (MotorContext)

Reactコンテキストを使用して状態を一元管理
APIとUIの間の橋渡し役
エラー処理と読み込み状態の管理
*/

import React, { createContext, useState, useContext, useEffect } from 'react';
import { MotorService } from '../api/motorService';

// デフォルトサービスを作成
const defaultService = new MotorService();

// コンテキストの作成
const MotorContext = createContext();

// カスタムフックでコンテキストへの簡単なアクセスを提供
export const useMotor = () => {
    const context = useContext(MotorContext);
    if (!context) {
        throw new Error('useMotor must be used within a MotorProvider');
    }
    return context;
};
  
// プロバイダーコンポーネント
export const MotorProvider = ({ children, service = defaultService }) => {
    // モーターの状態
    const [motorValues, setMotorValues] = useState({
        vibe: 0,
        moter_r: 0,
        moter_l: 0
    });
    
    // ロード状態とエラー状態
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(null);
    
    // 初期データ取得
    const fetchAllMotorValues = async () => {
        setLoading(true);
        setErrors({});
      
        try {
            const values = await service.getAllMotorValues();
            setMotorValues(values);
        } catch (error) {
            if (error.device) {
                // 特定のデバイスに関するエラー
                setErrors(prev => ({ ...prev, [error.device]: error.error.message }));
            } else {
                // 一般的なエラー
                setErrors(prev => ({ ...prev, general: error.message }));
            }
        } finally {
            setLoading(false);
        }
    };
    
    // コンポーネントマウント時に初期データを取得
    useEffect(() => {
        fetchAllMotorValues();
    }, []);
    
    // モーター値の更新
    const updateMotorValue = async (device, value) => {
        // UIの応答性向上のためローカル状態を即時更新
        setMotorValues(prev => ({ ...prev, [device]: value }));
        setUpdateSuccess(null);
        
        try {
            await service.setMotorValue(device, value);
            
            // 更新成功通知
            setUpdateSuccess(`${device} successfully updated to ${value}`);
            
            // 3秒後に成功メッセージをクリア
            setTimeout(() => {
                setUpdateSuccess(null);
            }, 3000);
        
        } catch (error) {
            setErrors(prev => ({ ...prev, [device]: error.message }));
            // エラー発生時は最新の値を再取得
            fetchAllMotorValues();
        }
    };
    
    // コンテキスト値の定義
    const value = {
        motorValues,
        loading,
        errors,
        updateSuccess,
        updateMotorValue,
        refreshMotorStatus: fetchAllMotorValues
    };
    
    return (
        <MotorContext.Provider value={value}>
            {children}
        </MotorContext.Provider>
    );
};
