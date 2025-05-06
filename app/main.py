import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import subprocess

from fastapi.middleware.cors import CORSMiddleware  # CORSミドルウェアをインポート

app = FastAPI()

import lgpio
import time
import threading
import atexit

from pydantic import BaseSettings

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 必要に応じて特定のオリジンを指定（例: ["http://localhost:3000"]）
    allow_credentials=True,
    allow_methods=["*"],  # 必要に応じて特定のHTTPメソッドを指定
    allow_headers=["*"],  # 必要に応じて特定のHTTPヘッダーを指定
)

# 設定モデル
class Settings(BaseSettings):
    voice_talk_path: str = "/opt/aquestalkpi/AquesTalkPi"

    class Config:
        env_file = ".env"  # .envファイルから設定を読み込む

# 設定インスタンスを作成
settings = Settings()

# 設定値を表示
print("適用された設定値: %s", settings.dict())

# GPIOピン番号を指定
h = lgpio.gpiochip_open(0)
VIBE_PIN = 26

R_MOTER_PIN1 = 20
R_MOTER_PIN2 = 21
L_MOTER_PIN1 = 13
L_MOTER_PIN2 = 19

# GPIO設定
lgpio.gpio_claim_output(h, VIBE_PIN)
lgpio.gpio_claim_output(h, R_MOTER_PIN1)
lgpio.gpio_claim_output(h, R_MOTER_PIN2)
lgpio.gpio_claim_output(h, L_MOTER_PIN1)
lgpio.gpio_claim_output(h, L_MOTER_PIN2)


class MoterController(threading.Thread):
    def __init__(self, pin, frequency=100, duty_cycle=50):
        super().__init__()
        self.pin = pin
        self.frequency = frequency
        self.duty_cycle = duty_cycle
        self.running = True
        self.lock = threading.Lock()

    def run(self):
        period = 1 / self.frequency
        while self.running:
            with self.lock:
                on_time = period * (self.duty_cycle / 100)
                off_time = period * (1 - self.duty_cycle / 100)

            if self.duty_cycle == 0:
                # 停止
                time.sleep(on_time)
                lgpio.gpio_write(h, self.pin, 0)
                time.sleep(off_time)
                lgpio.gpio_write(h, self.pin, 0)
            else:
                lgpio.gpio_write(h, self.pin, 1)
                time.sleep(on_time)
                lgpio.gpio_write(h, self.pin, 0)
                time.sleep(off_time)

    def set_duty_cycle(self, duty_cycle):
        with self.lock:
            self.duty_cycle = max(0, min(100, duty_cycle))

    def stop(self):
        self.running = False
        lgpio.gpio_write(h, self.pin, 0)

# モーターコントローラを双方向に対応
class MoterController2(threading.Thread):
    def __init__(self, pin1, pin2, frequency=100, duty_cycle=50):
        super().__init__()
        self.pin1 = pin1  # 正転用ピン
        self.pin2 = pin2  # 逆転用ピン
        self.frequency = frequency
        self.duty_cycle = duty_cycle
        self.running = True
        self.lock = threading.Lock()

    def run(self):
        period = 1 / self.frequency
        while self.running:
            # 設定を反映
            with self.lock:
                abs_duty_cycle = abs(self.duty_cycle)
                on_time = period * (abs_duty_cycle / 100)
                off_time = period * (1 - abs_duty_cycle / 100)
                if self.duty_cycle == 0:
                    # 停止
                    lgpio.gpio_write(h, self.pin1, 0)
                    lgpio.gpio_write(h, self.pin2, 0)
                elif self.duty_cycle >= 0:
                    # 正転
                    lgpio.gpio_write(h, self.pin1, 1)
                    lgpio.gpio_write(h, self.pin2, 0)
                else:
                    # 逆転
                    lgpio.gpio_write(h, self.pin1, 0)
                    lgpio.gpio_write(h, self.pin2, 1)

            # モーターを動かす
            time.sleep(on_time)
            lgpio.gpio_write(h, self.pin1, 0)
            lgpio.gpio_write(h, self.pin2, 0)
            time.sleep(off_time)

    def set_duty_cycle(self, duty_cycle):
        """デューティサイクルを変更する"""
        with self.lock:
            self.duty_cycle = max(-100, min(100, duty_cycle))  # -100～100の範囲に制限

    def stop(self):
        self.running = False
        lgpio.gpio_write(h, self.pin1, 0)  # モーター停止
        lgpio.gpio_write(h, self.pin2, 0)

# すべて停止しておく
lgpio.gpio_write(h, VIBE_PIN, 0)
lgpio.gpio_write(h, R_MOTER_PIN1, 0)
lgpio.gpio_write(h, R_MOTER_PIN2, 0)
lgpio.gpio_write(h, L_MOTER_PIN1, 0)
lgpio.gpio_write(h, L_MOTER_PIN2, 0)

# バイブレーションモーターの実験
vibe_thread = MoterController(VIBE_PIN, frequency=100, duty_cycle=0)  # 振動モーターは単方向
vibe_thread.start()

# 双方向回転のモーターの実験
moter_r_thread = MoterController2(R_MOTER_PIN1, R_MOTER_PIN2, frequency=100, duty_cycle=0)
moter_r_thread.start()

moter_l_thread = MoterController2(L_MOTER_PIN1, L_MOTER_PIN2, frequency=100, duty_cycle=0)
moter_l_thread.start()

# 本番環境では、ビルドされたReactアプリを提供する
# フロントエンドのビルドディレクトリをマウント
#app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
#app.mount("/assets", StaticFiles(directory="../frontend/build/assets"), name="assets")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

# モーターのデューティ比を設定するリクエストモデル
class DutyCycleRequest(BaseModel):
    duty_cycle: int

@app.post("/set_duty_cycle/vibe")
def set_vibe_duty_cycle(request: DutyCycleRequest):
    if not (0 <= request.duty_cycle <= 100):
        raise HTTPException(status_code=400, detail="デューティサイクルは0～100の範囲で指定してください")
    vibe_thread.set_duty_cycle(request.duty_cycle)

    return {"message": f"バイブレーションモーターのデューティサイクルを {request.duty_cycle}% に設定しました"}

@app.post("/set_duty_cycle/moter_r")
def set_moter_r_duty_cycle(request: DutyCycleRequest):
    if not (-100 <= request.duty_cycle <= 100):
        raise HTTPException(status_code=400, detail="デューティサイクルは-100～100の範囲で指定してください")
    moter_r_thread.set_duty_cycle(request.duty_cycle)

    return {"message": f"双方向回転モーター1のデューティサイクルを {request.duty_cycle}% に設定しました"}

@app.post("/set_duty_cycle/moter_l")
def set_moter_l_duty_cycle(request: DutyCycleRequest):
    if not (-100 <= request.duty_cycle <= 100):
        raise HTTPException(status_code=400, detail="デューティサイクルは-100～100の範囲で指定してください")
    moter_l_thread.set_duty_cycle(request.duty_cycle)

    return {"message": f"双方向回転モーター2のデューティサイクルを {request.duty_cycle}% に設定しました"}

# モーターの状態を取得するエンドポイント
@app.get("/get_duty_cycle/vibe")
def get_vibe_duty_cycle():
    return {"duty_cycle": vibe_thread.duty_cycle}

@app.get("/get_duty_cycle/moter_r")
def get_moter_r_duty_cycle():
    return {"duty_cycle": moter_r_thread.duty_cycle}

@app.get("/get_duty_cycle/moter_l")
def get_moter_l_duty_cycle():
    return {"duty_cycle": moter_l_thread.duty_cycle}

def voice_app(message):
    process_aquestalk = subprocess.Popen(
        [settings.voice_talk_path, message],  # 設定からパスを取得
        stdout=subprocess.PIPE
    )
    subprocess.run(["aplay"], stdin=process_aquestalk.stdout)
    process_aquestalk.stdout.close()

# 単純な文字列メッセージを受け取るリクエストモデル
class MessageRequest(BaseModel):
    message: str

@app.post("/whisper_message")
def whisper_message(request: MessageRequest):
    voice_app(f"{request.message}")
    return {"message": f"{request.message} ok"}

# SPA用のルート - すべての未処理のルートはindex.htmlを返す
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # APIエンドポイントへのアクセスは処理しない
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404)

    # SPAのindex.htmlを返す
    spa_path = "../frontend/build/index.html"
    if os.path.exists(spa_path):
        return FileResponse(spa_path)
    else:
        raise HTTPException(status_code=404, detail="SPA build not found")

# プログラム終了時の処理
def cleanup():
    print("Cleaning up resources...")
    vibe_thread.stop()
    moter_r_thread.stop()
    moter_l_thread.stop()
    # スレッドがきちんと停止するまで少し待つ
    time.sleep(0.5)
    # GPIOをクリーンアップ
    lgpio.gpiochip_close(h)

# 終了時にcleanup関数を呼び出す
atexit.register(cleanup)

if __name__ == "__main__":
    # 明示的にreload=Falseを指定
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
