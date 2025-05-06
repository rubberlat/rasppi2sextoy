# SexToy Control Project

このプロジェクトは、各種おもちゃを制御するためのAPIサーバです。
ラズパイ上で動作します。
別途おもちゃを接続したハードウェアが必要です。

## セットアップ手順
uvicorn app.main:app --reload
もしくは
uvicorn app.main:app --host 0.0.0.0 --reload

## APIテスト
```
# バイブレーションモーター
curl -X POST -H "Content-Type: application/json" -d '{"duty_cycle": 50}' http://localhost:8000/set_duty_cycle/vibe

# モーターR
curl -X POST -H "Content-Type: application/json" -d '{"duty_cycle": +50}' http://localhost:8000/set_duty_cycle/moter_r

# モーターL
curl -X POST -H "Content-Type: application/json" -d '{"duty_cycle": -50}' http://localhost:8000/set_duty_cycle/moter_l

# 読み上げ
curl -X POST -H "Content-Type: application/json" -d '{"message": "読み上げテスト"}' http://localhost:8000/whisper_message
```

## ブラウザからの操作
また今度つくります。
