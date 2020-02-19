# "pip install pywin32" required
import win32clipboard as w
import win32con
import win32api


def setText(aString):
    w.OpenClipboard()
    w.EmptyClipboard()
    w.SetClipboardData(win32con.CF_UNICODETEXT, aString)
    w.CloseClipboard()


if __name__ == '__main__':
    setText("test")
