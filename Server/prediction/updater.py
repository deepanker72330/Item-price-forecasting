from datetime import datetime
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from prediction.models import price, product
from core.tracker import parseProductPage


def updatePrice():
    #obj = product.objects.raw("SELECT DISTINCT pid, domain, url FROM prediction_product")
    curr_hour = datetime.now().hour
    if curr_hour!=14:
        return

    m = []
    obj = product.objects.all()

    for i in obj:
        if i.pid not in m:
            details = parseProductPage(i.url)
            a = price(
                domain=i.domain,
                pid=i.pid,
                price=details['price'],
                date=date.today()
            )
            a.save()
            m.append(i.pid)


def start():
    scheduler = BackgroundScheduler()
    updatePrice()
    scheduler.add_job(updatePrice, 'interval', minutes=60)
    scheduler.start()
