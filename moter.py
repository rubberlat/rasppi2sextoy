# スタンドアロンで動作する制御プログラム

import lgpio
import time
import threading

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

try:
    while True:
        try:
            new_duty_cycle = int(input("バイブレーションモーター:新しいデューティサイクルを入力してください (0～100): "))
            if 0 <= new_duty_cycle <= 100:
                vibe_thread.set_duty_cycle(new_duty_cycle)
                print(f"デューティサイクルを {new_duty_cycle}% に変更しました")
            else:
                print("0～100の範囲で入力してください")
        except ValueError:
            print("無効な入力です。数値を入力してください")

        try:
            new_duty_cycle = int(input("ニップルドームＲ:新しいデューティサイクルを入力してください (-100～100): "))
            if -100 <= new_duty_cycle <= 100:
                moter_r_thread.set_duty_cycle(new_duty_cycle)
                print(f"デューティサイクルを {new_duty_cycle}% に変更しました")
            else:
                print("-100～100の範囲で入力してください")
        except ValueError:
            print("無効な入力です。数値を入力してください")

        try:
            new_duty_cycle = int(input("ニップルドームＬ:新しいデューティサイクルを入力してください (-100～100): "))
            if -100 <= new_duty_cycle <= 100:
                moter_l_thread.set_duty_cycle(new_duty_cycle)
                print(f"デューティサイクルを {new_duty_cycle}% に変更しました")
            else:
                print("-100～100の範囲で入力してください")
        except ValueError:
            print("無効な入力です。数値を入力してください")
            
except KeyboardInterrupt:
    print("プログラムを終了します")

finally:
    vibe_thread.stop()
    vibe_thread.join()

    moter_r_thread.stop()
    moter_r_thread.join()

    moter_l_thread.stop()
    moter_l_thread.join()

    lgpio.gpiochip_close(h)

