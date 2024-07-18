from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
import logging

from utils import ai_tools


# 任务执行函数
def job_func(job_id):
    ai_tools.time_kipper()


# 事件监听
def job_exception_listener(event):
    if event.exception:
        # todo：异常处理, 告警等
        print('The job crashed :(')
    else:
        print('The job worked :)')


# 初始化定时器
def init_apscheduler():
    # 日志
    logging.basicConfig()
    logging.getLogger('apscheduler').setLevel(logging.DEBUG)
    # 定义一个后台任务非阻塞调度器---不会阻塞线程，需要后面执行flask或者其他可以阻塞线程的方法
    scheduler = BackgroundScheduler()
    # 添加一个任务到内存中
    # 触发器：trigger='interval' seconds=10 每10s触发执行一次
    # 执行器：executor='default' 线程执行
    # 任务存储器：jobstore='default' 默认内存存储
    # 最大并发数：max_instances
    scheduler.add_job(job_func, trigger='interval', args=[1], id='1', name='a test job', max_instances=10,
                      jobstore='default', executor='default', hours=1, start_date="2024-01-01 00:00:00")
    # 设置任务监听
    scheduler.add_listener(job_exception_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
    # 启动调度器
    scheduler.start()
