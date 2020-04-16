import smtplib
#发送字符串的邮件
from email.mime.text import MIMEText
#处理多种形态的邮件主体我们需要 MIMEMultipart 类
from email.mime.multipart import MIMEMultipart
#处理图片需要 MIMEImage 类
from email.mime.image import MIMEImage
 
#设置服务器所需信息
fromaddr = '137xxx@163.com'#邮件发送方邮箱地址
password = 'zzz'#密码(部分邮箱为授权码) 
toaddrs = ['137xxx@163.com', '137xxxxx@qq.com']#邮件接受方邮箱地址，注意需要[]包裹，这意味着你可以写多个邮件地址群发
 
 
#设置email信息
data.to_excel(writer,sheet_name='total',index=False)
#---------------------------发送字符串的邮件-----------------------------
#邮件内容设置
message = MIMEText('hello,ziqiiii','plain','utf-8')
#邮件主题       
message['Subject'] = 'ziqiiii test email' 
#发送方信息
message['From'] = sender 
#接受方信息     
message['To'] = receivers[0]  
#---------------------------------------------------------------------
 
 
#登录并发送邮件
try:
    server = smtplib.SMTP('smtp.163.com')#163邮箱服务器地址，端口默认为25
    server.login(fromaddr,password)
    server.sendmail(fromaddr, toaddrs, message.as_string())
    print('success')
    server.quit()
 
except smtplib.SMTPException as e:
    print('error',e) #打印错误
