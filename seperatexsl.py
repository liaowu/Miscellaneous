import pandas as pd
import xlsxwriter
import xlrd

data=pd.read_excel('chaifen.xls',encoding='dbk')
area_list=list(set(data['Shop']))
for j in area_list:
	df=data[data['Shop']==j]
	writer=pd.ExcelWriter(f'{str(j)}finishedchaifen.xlsx',engine='xlsxwriter')
	df.to_excel(writer,sheet_name=j,index=False)
	writer.save()
