  -- Step 1 Add Form to forms table for the menu in APP

  INSERT INTO Form
           (FormID
           ,SortOrder
           ,FormCategoryId)
     VALUES
           (372308
           ,null
           ,2)
  
 -- Step 2 Add the new form into the form description table
         
  INSERT INTO FormDescription
           (FormID
           ,FormVersion
           ,FormName)
     VALUES
           (372308
           ,1
           ,'GENERAL STATEMENT')

  -- Step 3 Verify the form is in the table and get the id (eg 1400)

    select * from FormDescription order by FormName

  -- Step 4 Add form fields to the form field description table. Make sure to change the first feild in the values to the id from setp 3
  -- Add fields as required with field names, descriptions, types, sections

      INSERT INTO FormFieldDescription
           (FormDescriptionID
           ,XPath
           ,fieldKey
           ,fieldName
           ,fieldType
           ,fieldValueType
           ,FieldOrder
           ,SectionName
           ,FieldNameOverride
           ,FieldVisibleOverride
           ,FieldWidthOverride
           ,AllowMultiple
           ,FormSubID)
     VALUES
           (1400,'/date','date','Date','DatePicker','DateOnly',1,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/site','site','Site','GlobalListPicker','Array',2,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/job_number','job_number','Job Number','GlobalListPicker','Array',3,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/level','level','Level','GlobalListPicker','Array',4,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/workplace','workplace','Workplace','SingleLineEntryAlpha','String',5,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/supervisor','supervisor','Supervisor','GlobalListPicker','Array',6,'Header', NULL,NULL,NULL,0,NULL),
		   (1400,'/durationlistpicker_81','durationlistpicker_81','Duration','GlobalListPicker','Array',7,'Duration', NULL,NULL,NULL,0,NULL),
		   (1400,'/Report_Distribution1','Report_Distribution1','Report Distribution','GlobalListPicker','Array',8,'Distribution', NULL,NULL,NULL,1,NULL),
		   (1400,'/worker','worker','Worker','GlobalListPicker','Array',9,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/Other_Worker','Other_Worker','Other Worker','SingleLineEntryAlpha','String',10,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/occupation','occupation','Occupation','SingleLineEntryAlpha','String',11,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/department','department','Department','SingleLineEntryAlpha','String',12,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/company','company','Company','SingleLineEntryAlpha','String',13,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/involvement','involvement','Involvement','GlobalListPicker','Array',14,'Statement Information', NULL,NULL,NULL,0,NULL),
		   (1400,'/worker_statement','worker_statement','Worker Statement','SingleLineEntryAlpha','String',15,'Statement Summary', NULL,NULL,NULL,0,NULL),
		   (1400,'/general_photos','general_photos','General Photos','MultiPhotoPicker','Uncomparable',16,'Pictures', NULL,NULL,NULL,0,NULL),
		   (1400,'/signature','signature','Worker Signature','SignatureCapture','Uncomparable',17,'Signatures', NULL,NULL,NULL,0,NULL)

  -- step 5 Add new form to the reports table

		INSERT INTO Reports
           (ReportName
           ,ReportDescription
           ,ReportCategory
           ,ReportURL
           ,SSRSReportName
           ,SingleFormReportID)
     VALUES
           ('General Statement'
           ,'General Statement'
           ,'Basic Form'
           ,'generalstatement.prpt'
           ,'generalstatement'
           ,372308)

  -- step 6 Add new form to mobile forms table

    INSERT INTO MobileForms
           (MobileFormName,
            FormID,
            FormURL,
            mfo_enable)
     VALUES
           ('GENERAL STATEMENT'
           ,372308
           ,'/forms/formGeneralStatement.php'
           ,1)

  -- step 7 Make sure that these tables get promoted to test
    -- Form
    -- FormDescription
    -- FormFieldDescription
    -- Reports
    -- MobileForms