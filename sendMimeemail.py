import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication 
 
if __name__ == '__main__':
        fromaddr = 'liaowu70@gmail.com'
        password = 'liaowu5384570'
     #   toaddrs = ['137xxxx@163.com', '137xxxx@qq.com']
        toaddrs = 'liaowu70@gmail.com'
 
        content = 'hello, this is email content.'
        textApart = MIMEText(content)
 
        imageFile = '1.png'
        imageApart = MIMEImage(open(imageFile, 'rb').read(), imageFile.split('.')[-1])
        imageApart.add_header('Content-Disposition', 'attachment', filename=imageFile)
 
        pdfFile = 'wlpc.pdf'
        pdfApart = MIMEApplication(open(pdfFile, 'rb').read())
        pdfApart.add_header('Content-Disposition', 'attachment', filename=pdfFile)
    
 
        zipFile = 'wlpc.pdf.zip'
        zipApart = MIMEApplication(open(zipFile, 'rb').read())
        zipApart.add_header('Content-Disposition', 'attachment', filename=zipFile)
 
        m = MIMEMultipart()
        m.attach(textApart)
        m.attach(imageApart)
        m.attach(pdfApart)
        m.attach(zipApart)
        m['Subject'] = 'title'
 
        try:
            server = smtplib.SMTP('smtp.gmail.com')
            server.connect("smtp.gmail.com",587)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(fromaddr,password)
            print('done again')
            server.sendmail(fromaddr, toaddrs, m.as_string())
            print('success')
            server.quit()
        except smtplib.SMTPException as e:
            print('error:',e) #打印错误
