from web import controller
from task import ap_scheduler

if __name__ == '__main__':
    # 启动定时器
    ap_scheduler.init_apscheduler()
    # 启动flask-mqtt
    controller.app.run(host='0.0.0.0', port=5000)
