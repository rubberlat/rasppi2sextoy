/*
API層 (MotorService)

API通信のみを担当する抽象化レイヤー
複数のバックエンドに対応可能
*/

export class MotorService {
    constructor(baseUrl = 'http://raspberrypi:8000') {
      this.baseUrl = baseUrl;
    }
  
    // すべてのモーターの値を一度に取得
    async getAllMotorValues() {
      const devices = ['vibe', 'moter_r', 'moter_l'];
      const results = {};
      
      await Promise.all(
        devices.map(async (device) => {
          try {
            const result = await this.getMotorValue(device);
            results[device] = result;
          } catch (error) {
            // エラー情報を格納
            results[device] = null;
            throw { device, error };
          }
        })
      );
      
      return results;
    }
  
    // 特定のモーターの値を取得
    async getMotorValue(deviceName) {
      const url = `${this.baseUrl}/get_duty_cycle/${deviceName}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.duty_cycle;
    }
  
    // モーターの値を設定
    async setMotorValue(deviceName, value) {
      const url = `${this.baseUrl}/set_duty_cycle/${deviceName}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ duty_cycle: value })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update ${deviceName}: ${response.status}`);
      }
      
      return await response.json();
    }
}
  
// モックサービス実装（テスト用）
export class MockMotorService {
    constructor() {
        this.mockValues = {
        vibe: 0,
        moter_r: 0,
        moter_l: 0
        };
    }

    async getAllMotorValues() {
        return { ...this.mockValues };
    }

    async getMotorValue(deviceName) {
        return this.mockValues[deviceName] || 0;
    }

    async setMotorValue(deviceName, value) {
        this.mockValues[deviceName] = value;
        return { success: true, duty_cycle: value };
    }
}
