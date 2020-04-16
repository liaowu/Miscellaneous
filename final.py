import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

import pandas as pd
import xlsxwriter
import xlrd

data=pd.read_excel('chaifen.xls',encoding='gbk')
data2=pd.read_excel('emaillist.xls',converters={'Shop':str,'Rec':str,'Cc':str},encoding='gbk')
area_list=list(set(data['Shop'])) 

for j in area_list:
    df=data[data['Shop']==j]
    writer=pd.ExcelWriter(f'{str(j)}finishedchaifen.xlsx',engine='xlsxwriter')
    df.to_excel(writer,sheet_name=j,index=False)
    writer.save()

for j in area_list:
    def send_mail():
        fromaddr = '@gmail.com'
        password = 'mypassword'
        toaddrs = list(data2['Rec'][data2['Shop']==j])[0]
        ccaddrs = list(data2['Cc'][data2['Shop']==j])[0]
		# content = 'hello, this is email content.'
        content = '''
		<h2>Hello,This is a test mail.</h2>
		Hello Guys.
		Do you want to come with us?
		'''
        textApart=MIMEText(content)
        attachFile='str(j)}finishedchaifen.xlsx'
        attachedApart=MIMEApplication(open(attachFile,'rb').read())
        attachedApart.add_header('Content-Disposition','attachment',filename=attachFile)

        m = MIMEMultipart()
        m.attach(textApart)
        m.attach(attachedApart)
        m['Subject'] = 'Mail Test5'+'you are the best'

        try:
            server = smtplib.SMTP('smtp.gmail.com')
            server.connect("smtp.gmail.com",587)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(fromaddr,password)
            server.sendmail(fromaddr, toaddrs, m.as_string())
            print('success')
            server.quit()

        except smtplib.SMTPException as e:
            print('error:',e) #打印错误

    if __name__ == '__main__':
        send_mail()
        print('success')
