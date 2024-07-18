import datetime


# 获取当前时分字符串
def get_now_time_str():
    # 获取当前时间
    current_time = datetime.datetime.now()
    # 输出当前时间
    print("[time_tools.get_now_time_str] "+current_time.__str__())
    # 获取时分
    current_hour = current_time.hour
    current_minute = current_time.minute
    # 组装
    time_str = current_hour.__str__() + "点" + current_minute.__str__() + "分"
    print("[time_tools.get_now_time_str] "+time_str)
    return time_str


# 获取今日日期字符串
def get_now_date_str():
    # 获取当前时间
    current_time = datetime.datetime.now()
    # 输出当前时间
    print("[time_tools.get_now_date_str] "+current_time.__str__())
    # 获取时分
    current_month = current_time.month
    current_day = current_time.day
    # 组装
    date_str = current_month.__str__() + "月" + current_day.__str__() + "日"
    print("[time_tools.get_now_date_str] "+date_str)
    return date_str


# 当前时间是否在9-12/15-21范围内
def is_hour_in_range():
    # 获取当前时间
    current_time = datetime.datetime.now()
    # 获取小时
    current_hour = current_time.hour
    # 判断并返回
    if (9 <= current_hour <= 12) or (15 <= current_hour <= 21):
        print("[time_tools.is_hour_in_range] 当前时间"+current_hour.__str__()+"点，进行整点报时。")
        return True
    print("[time_tools.is_hour_in_range] 当前时间" + current_hour.__str__() + "点，不进行整点报时。")
    return False


if __name__ == "__main__":
    get_now_time_str()
