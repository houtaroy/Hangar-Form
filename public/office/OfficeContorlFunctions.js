var OFFICE_CONTROL_OBJ;//控件对象
var IsFileOpened;      //控件是否打开文档
var fileType ;
var fileTypeSimple;

/**
 * 页面加载事件
 * @param fileUrl
 */
function intializePage(id)
{
	console.log(id);
	OFFICE_CONTROL_OBJ = document.all("TANGER_OCX")//获取对象
	initObjConfig();
	//initCustomMenus();//加载菜单项内容(不需要加载菜单)
	var fileUrl = getFileUrl(id);
	NTKO_OCX_OpenDoc(fileUrl);//加载需要打开的文件
}
//初始化控件配置
function initObjConfig(){
	OFFICE_CONTROL_OBJ.Statusbar=true;//是否显示word文档的导航栏
	OFFICE_CONTROL_OBJ.Caption="河北省生态环境厅";//是否显示word文档的导航栏
	OFFICE_CONTROL_OBJ.TitleBar=false;//是否显示标题栏
	OFFICE_CONTROL_OBJ.RibbonBars=true;//是否显示OFFICE功能区
	OFFICE_CONTROL_OBJ.ToolBars=true;//是否显示工具栏
	OFFICE_CONTROL_OBJ.CustomToolBar=true;//是否显示工具栏
	OFFICE_CONTROL_OBJ.Menubar=true;//是否显示菜单栏

	OFFICE_CONTROL_OBJ.AddCustomToolButton("保存  ", 5);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("保存到本地  ", 5);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("打印  ", 9);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("隐藏痕迹  ", 11);
	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(3,true,false);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("显示痕迹  ", 11);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("打开文件  ", 4);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("全屏  ", 13);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("退出全屏  ", 14);
	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(7,true,false);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("打开修订（保留痕迹）  ", 3);
	OFFICE_CONTROL_OBJ.AddCustomToolButton("关闭修订（取消痕迹）  ", 2);
	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(9,true,false);


	OFFICE_CONTROL_OBJ.IsShowFullScreenButton=false;//去掉全屏按钮
}
/**
 * 页面关闭事件，查看是否当前文档有被保存（后续可以利用到页面切换过程中）
 */
function onPageClose()
{
	if(!OFFICE_CONTROL_OBJ.activeDocument.saved)
	{
		if(confirm( "文档修改过,还没有保存,是否需要保存?"))
		{
			saveFileToUrl();
		}
	}
}
/**
 * 切换显示痕迹
 */
function toggleRevisions(closeIndex,openIndex){

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(closeIndex,true,false);

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(openIndex,true,true);

	setShowRevisions(!OFFICE_CONTROL_OBJ.ActiveDocument.ShowRevisions);

}
/**
 * 切换全屏状态
 */
function toggleFullScreenMode(closeIndex,openIndex){

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(closeIndex,true,false);

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(openIndex,true,true);

	OFFICE_CONTROL_OBJ.FullScreenMode = !OFFICE_CONTROL_OBJ.FullScreenMode;

}

/**
 * 切换修订状态
 */
function toggleReviewMode(closeIndex,openIndex){

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(closeIndex,true,false);

	OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(openIndex,true,true);

	SetReviewMode(!OFFICE_CONTROL_OBJ.ActiveDocument.TrackRevisions)
}
function NTKO_OCX_OpenDoc(fileUrl)
{
	OFFICE_CONTROL_OBJ.openfromurl(fileUrl,"word.document");
}
function setFileOpenedOrClosed(bool)
{
	IsFileOpened = bool;
	fileType = OFFICE_CONTROL_OBJ.DocType ;
}
function trim(str)
{ //删除左右两端的空格
　　return str.replace(/(^\s*)|(\s*$)/g, "");
}
//上传附件
function saveFileToUrl()
{
	var myUrl =document.forms[0].action ;
	var fileName = "测试1111";
	var result  ;
	if(IsFileOpened)
	{
		switch (OFFICE_CONTROL_OBJ.doctype)
		{
			case 1:
				fileType = "Word.Document";
				break;
			case 2:
				fileType = "Excel.Sheet";
				break;
			case 3:
				fileType = "PowerPoint.Show";
				break;
			case 4:
				fileType = "Visio.Drawing";
				break;
			case 5:
				fileType = "MSProject.Project";
				break;
			case 6:
				fileType = "WPS Doc";
				break;
			case 7:
				fileType = "Kingsoft Sheet";
				break;
			default :
				fileType = "unkownfiletype";
		}
		//利用控件方法实现form表单提交
		result = OFFICE_CONTROL_OBJ.saveToURL(myUrl,//提交到的url地址
		"upLoadFile",//文件域的id，类似<input type=file id=upLoadFile 中的id
		"fileType="+fileType,          //与控件一起提交的参数如："p1=a&p2=b&p3=c"
		fileName,    //上传文件的名称，类似<input type=file 的value
		0    //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
		);
		result=trim(result);
		document.all("statusBar").innerHTML="服务器返回信息:"+result;
		alert(result);
		window.close();
	}
}
//上传html
function saveFileAsHtmlToUrl()
{
	var myUrl = "upLoadHtmlFile.jsp"	;
	var htmlFileName = document.all("fileName").value+".html";
	var result;
	if(IsFileOpened)
	{
		result=OFFICE_CONTROL_OBJ.PublishAsHTMLToURL("upLoadHtmlFile.jsp","uploadHtml","htmlFileName="+htmlFileName,htmlFileName);
		result=trim(result);
		document.all("statusBar").innerHTML="服务器返回信息:"+result;
		alert(result);
		window.close();
	}
}
//上传PDF
function saveFileAsPdfToUrl()
{
	var myUrl = "upLoadPdfFile.jsp"	;
	var pdfFileName = document.all("fileName").value+".pdf";
	if(IsFileOpened)
	{
		OFFICE_CONTROL_OBJ.PublishAsPdfToURL(myUrl,"uploadPdf","PdfFileName="+pdfFileName,pdfFileName,"","",true,false);
	}
}
function testFunction()
{
	alert(IsFileOpened);
}
/** 印章相关内容（暂时不需要）
function addServerSecSign()
{
	var signUrl=document.all("secSignFileUrl").options[document.all("secSignFileUrl").selectedIndex].value;
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{
			alert("正式版本用户请插入EKEY！\r\n\r\n此为电子印章系统演示功能，请购买正式版本！");
					OFFICE_CONTROL_OBJ.AddSecSignFromURL("ntko",signUrl);
			}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}
function addLocalSecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecSignFromLocal("ntko","");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}
function addEkeySecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecSignFromEkey("ntko");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}
function addHandSecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecHandSign("ntko");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}

function addServerSign(signUrl)
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddSignFromURL("ntko",//印章的用户名
				signUrl,//印章所在服务器相对url
				100,//左边距
				100,//上边距 根据Relative的设定选择不同参照对象
				"ntko",//调用DoCheckSign函数签名印章信息,用来验证印章的字符串
				3,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
				100,//缩放印章,默认100%
				1);   //0印章位于文字下方,1位于上方

			}
			catch(error){}
	}
}

function addLocalSign()
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddSignFromLocal("ntko",//印章的用户名
					"",//缺省文件名
					true,//是否提示选择
					100,//左边距
					100,//上边距 根据Relative的设定选择不同参照对象
					"ntko",//调用DoCheckSign函数签名印章信息,用来验证印章的字符串
					3,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
					100,//缩放印章,默认100%
					1);   //0印章位于文字下方,1位于上方
			}
			catch(error){}
	}
}
function addPicFromUrl(picURL)
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{
				OFFICE_CONTROL_OBJ.AddPicFromURL(picURL,//图片的url地址可以时相对或者绝对地址
				false,//是否浮动,此参数设置为false时,top和left无效
				100,//left 左边距
				100,//top 上边距 根据Relative的设定选择不同参照对象
				1,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
				100,//缩放印章,默认100%
				1);   //0印章位于文字下方,1位于上方

			}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}
function addPicFromLocal()
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddPicFromLocal("",//印章的用户名
					true,//缺省文件名
					false,//是否提示选择
					100,//左边距
					100,//上边距 根据Relative的设定选择不同参照对象
					1,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
					100,//缩放印章,默认100%
					1);   //0印章位于文字下方,1位于上方
			}
			catch(error){}
	}
}
**/
function TANGER_OCX_AddDocHeader(strHeader)
{
	if(!IsFileOpened)
	{return;}
	var i,cNum = 30;
	var lineStr = "";
	try
	{
		for(i=0;i<cNum;i++) lineStr += "_";  //生成下划线
		with(OFFICE_CONTROL_OBJ.ActiveDocument.Application)
		{
			Selection.HomeKey(6,0); // go home
			Selection.TypeText(strHeader);
			Selection.TypeParagraph(); 	//换行
			Selection.TypeText(lineStr);  //插入下划线
			// Selection.InsertSymbol(95,"",true); //插入下划线
			Selection.TypeText("★");
			Selection.TypeText(lineStr);  //插入下划线
			Selection.TypeParagraph();
			//Selection.MoveUp(5, 2, 1); //上移两行，且按住Shift键，相当于选择两行
			Selection.HomeKey(6,1);  //选择到文件头部所有文本
			Selection.ParagraphFormat.Alignment = 1; //居中对齐
			with(Selection.Font)
			{
				NameFarEast = "宋体";
				Name = "宋体";
				Size = 12;
				Bold = false;
				Italic = false;
				Underline = 0;
				UnderlineColor = 0;
				StrikeThrough = false;
				DoubleStrikeThrough = false;
				Outline = false;
				Emboss = false;
				Shadow = false;
				Hidden = false;
				SmallCaps = false;
				AllCaps = false;
				Color = 255;
				Engrave = false;
				Superscript = false;
				Subscript = false;
				Spacing = 0;
				Scaling = 100;
				Position = 0;
				Kerning = 0;
				Animation = 0;
				DisableCharacterSpaceGrid = false;
				EmphasisMark = 0;
			}
			Selection.MoveDown(5, 3, 0); //下移3行
		}
	}
	catch(err){
		alert("错误：" + err.number + ":" + err.description);
	}
	finally{
	}
}

function insertRedHeadFromUrl(headFileURL)
{
	if(OFFICE_CONTROL_OBJ.doctype!=1)//OFFICE_CONTROL_OBJ.doctype=1为word文档
	{return;}
	OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.HomeKey(6,0);//光标移动到文档开头
	OFFICE_CONTROL_OBJ.addtemplatefromurl(headFileURL);//在光标位置插入红头文档
}
function openTemplateFileFromUrl(templateUrl)
{
	OFFICE_CONTROL_OBJ.openFromUrl(templateUrl);
}

function doHandSign()
{
	//if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)//此处设置只允许在word和excel中盖章.doctype=1是"word"文档,doctype=2是"excel"文档
	//{
		OFFICE_CONTROL_OBJ.DoHandSign2(
									"ntko",//手写签名用户名称
									"ntko",//signkey,DoCheckSign(检查印章函数)需要的验证密钥。
									0,//left
									0,//top
									1,//relative,设定签名位置的参照对象.0：表示按照屏幕位置插入，此时，Left,Top属性不起作用。1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落（为兼容以前版本默认方式）
									100);
	//}
}
/**
 * 根据文件ID获取文件流地址
 * @param fileId 文件ID
 */
function getFileUrl(fileId){
	//TODO 方法体后续完成,先默认写死
	var fileUrl = "http://localhost:8012/1.doc";
	return fileUrl;
}
/**
 * 设置保留痕迹
 * @param boolvalue
 */
function SetReviewMode(boolvalue)
{
	if(OFFICE_CONTROL_OBJ.doctype==1)
	{
		OFFICE_CONTROL_OBJ.ActiveDocument.TrackRevisions = boolvalue;//设置是否保留痕迹
	}
}
/**
 * 设置显示痕迹
 * @param boolvalue
 */
function setShowRevisions(boolevalue)
{
	if(OFFICE_CONTROL_OBJ.doctype==1)
	{
		OFFICE_CONTROL_OBJ.ActiveDocument.ShowRevisions =boolevalue;//设置是否显示痕迹
	}
}
/**
 * 设置允许打印
 * @param boolvalue
 */
function setFilePrint(boolvalue)
{
	OFFICE_CONTROL_OBJ.fileprint=boolvalue;//是否允许打印
}
/**
 * 设置允许新建
 * @param boolvalue
 */
function setFileNew(boolvalue)
{
	OFFICE_CONTROL_OBJ.FileNew=boolvalue;//是否允许新建
}
/**
 * 设置允许另存
 * @param boolvalue
 */
function setFileSaveAs(boolvalue)
{
	OFFICE_CONTROL_OBJ.FileSaveAs=boolvalue;//是否允许另存为
}
/**
 * 设置禁止粘贴
 * @param boolvalue
 */
function setIsNoCopy(boolvalue)
{
	OFFICE_CONTROL_OBJ.IsNoCopy=boolvalue;//是否禁止粘贴
}
//验证文档控件自带印章功能盖的章
function DoCheckSign()
{
   if(IsFileOpened)
   {
			var ret = OFFICE_CONTROL_OBJ.DoCheckSign
			(
			false,/*可选参数 IsSilent 缺省为FAlSE，表示弹出验证对话框,否则，只是返回验证结果到返回值*/
			"ntko"//使用盖章时的signkey,这里为"ntko"
			);//返回值，验证结果字符串
			//alert(ret);
   }
}
//设置工具栏
function setToolBar()
{
	OFFICE_CONTROL_OBJ.ToolBars=!OFFICE_CONTROL_OBJ.ToolBars;
}
//控制是否显示所有菜单
function setMenubar()
{
		OFFICE_CONTROL_OBJ.Menubar=!OFFICE_CONTROL_OBJ.Menubar;
}
//控制”插入“菜单栏
function setInsertMemu()
{
		OFFICE_CONTROL_OBJ.IsShowInsertMenu=!OFFICE_CONTROL_OBJ.IsShowInsertMenu;
	}
//控制”编辑“菜单栏
function setEditMenu()
{
		OFFICE_CONTROL_OBJ.IsShowEditMenu=!OFFICE_CONTROL_OBJ.IsShowEditMenu;
	}
//控制”工具“菜单栏
function setToolMenu()
{
	OFFICE_CONTROL_OBJ.IsShowToolMenu=!OFFICE_CONTROL_OBJ.IsShowToolMenu;
	}

//自定义菜单功能函数
function initCustomMenus()
{
	var myobj = OFFICE_CONTROL_OBJ;

	for(var menuPos=0;menuPos<3;menuPos++)
	{
		myobj.AddCustomMenu2(menuPos,"菜单"+menuPos+"(&"+menuPos+")");
		for(var submenuPos=0;submenuPos<10;submenuPos++)
		{
			if(1 ==(submenuPos % 3)) //主菜单增加分隔符。第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,false,"-",true);
			}
			else if(0 == (submenuPos % 2)) //主菜单增加子菜单，第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,true,"子菜单"+menuPos+"-"+submenuPos,false);
				//增加子菜单项目
				for(var subsubmenuPos=0;subsubmenuPos<9;subsubmenuPos++)
				{
					if(0 == (subsubmenuPos % 2))//增加子菜单项目
					{
						myobj.AddCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false,
							"子菜单项目"+menuPos+"-"+submenuPos+"-"+subsubmenuPos,false,menuPos*100+submenuPos*20+subsubmenuPos);
					}
					else //增加子菜单分隔
					{
						myobj.AddCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false,
							"-"+subsubmenuPos,true);
					}
					//测试禁用和启用
					if(2 == (subsubmenuPos % 4))
					{
						myobj.EnableCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false);
					}
				}
			}
			else //主菜单增加项目，第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,false,"菜单项目"+menuPos+"-"+submenuPos,false,menuPos*100+submenuPos);
			}

			//测试禁用和启用
			if(1 == (submenuPos % 4))
			{
				myobj.EnableCustomMenuItem2(menuPos,submenuPos,-1,false);
			}
		}
	}
}
