# import required files and modules

import requests
from bs4 import BeautifulSoup
import smtplib
import time
from url_parser import parse_url, get_url, get_base_url


def getFlipkartProduct(soup, url_object):
    priceObj = soup.find("div", {"class": "_30jeq3 _16Jk6d"})
    price = priceObj.get_text() if priceObj != None else 'no price'
    pnameObj = soup.find("span", {"class": "B_NuCI"})
    pname = pnameObj.get_text() if pnameObj != None else 'no pname'
    val = {"price": float(price[1:].replace(
        ',', '')), "pid": url_object.query["pid"], "productName": pname}
    return val


def getBewakoofProduct(soup, url_object):
    title = soup.find(id="testProName").get_text()
    price = soup.find(id="testNetProdPrice").get_text()
    val = {"price": float(price), "pid": title, "productName": title}
    return val


def getAlibabaProduct(soup, url_object):
    price = soup.find("span", {"class": "pre-inquiry-price"}).get_text()
    name = soup.find("h1", {"class": "module-pdp-title"}).get_text()
    val = {"price": float(price[1:]), "pid": name, "productName": name}
    return val


def getSnapdealProduct(soup, url_object):
    pid = url_object.file
    name = soup.find("h1", {"class": "pdp-e-i-head"}).get_text()
    price = soup.find("span", {"class": "payBlkBig"}).get_text()
    val = {"price": float(price), "pid": pid, "productName": name}
    return val


def getAmazonProduct(soup, url_object):
    name = soup.find(id="productTitle").get_text()
    price = None
    if(soup.find(id="priceblock_ourprice") == None):
        price = soup.find(id="priceblock_dealprice").get_text()
    else:
        price = soup.find(id="priceblock_ourprice").get_text()
    val = {"price": float(price[2:].replace(',', '')),
           "pid": url_object.dir, "productName": name}
    return val


def parseProductPage(URL):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'}
    page = requests.get(URL, headers=headers)

    URL_OBJECT = get_url(URL)
    domain = URL_OBJECT.domain
    soup = BeautifulSoup(page.content, 'html.parser')

    if(domain == 'flipkart'):
        ret = getFlipkartProduct(soup, URL_OBJECT)
        ret['domain'] = domain
        return ret

    elif(domain == 'bewakoof'):
        ret = getBewakoofProduct(soup, URL_OBJECT)
        ret['domain'] = domain
        return ret

    elif(domain == 'alibaba'):
        ret = getAlibabaProduct(soup, URL_OBJECT)
        ret['domain'] = domain
        return ret

    elif(domain == 'snapdeal'):
        ret = getSnapdealProduct(soup, URL_OBJECT)
        ret['domain'] = domain
        return ret

    elif(domain == 'amazon'):
        ret = getAmazonProduct(soup, URL_OBJECT)
        ret['domain'] = domain
        return ret

    else:
        print('Incompatible Website URL')
        return {}

# function that sends an email if the prices fell down


def send_mail():
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.ehlo()

    server.login('cs305.itemprice@gmail.com', '4TBbVaw^')

    subject = 'Price Fell Down'
    body = "Check the amazon link https://www.amazon.in/Bose-SoundLink-Wireless-Around-Ear-Headphones/dp/B0117RGG8E/ref=sr_1_11?qid=1562395272&refinements=p_89%3ABose&s=electronics&sr=1-11 "

    msg = f"Subject: {subject}\n\n{body}"

    server.sendmail(
        'cs305.itemprice@gmail.com',
        'arnav.guru@gmail.com',
        msg
    )
    print('Hey Email has been sent')
    # quit the server
    server.quit()
