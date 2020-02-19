import webbrowser
import win32clipboard as w
import win32con
import win32api
from hashlib import md5


def setText(aString):
    w.OpenClipboard()
    w.EmptyClipboard()
    w.SetClipboardData(win32con.CF_UNICODETEXT, aString)
    w.CloseClipboard()


def login(username, password):
    url = "http://202.119.81.112:9080/njlgdx/xk/LoginToXk?method=verify&USERNAME=" + \
        str(username.encode('UTF-8'), 'UTF-8') + '&PASSWORD=' + \
        str(md5(password.encode('UTF-8')).hexdigest().upper())
    return url


while 1:
    username = input("Input ID: ")
    password = input("Input password: ")
    url = login(username, password)
    print(url)
    setText(url)
    webbrowser.open(url, new=0, autoraise=True)
    print("-" * 50)
