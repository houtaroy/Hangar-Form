

//document.write("<script language='javascript' for=TANGER_OCX event='OnDocumentClosed()'></script>");
//document.write("<script language='javascript' for='TANGER_OCX' event='OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)'></script>");
//document.write("<script language='javascript' for='TANGER_OCX' event='OnCustomToolBarCommand(btnIdx)'></script>");

var OFFICE_CONTROL_OBJ;//控件对象
var IsFileOpened;      //控件是否打开文档
var fileType ;
var fileTypeSimple;


function OnDocumentClosed(){
	setFileOpenedOrClosed(false);
}

function OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj){
	OFFICE_CONTROL_OBJ.activeDocument.saved=true;//saved属性用来判断文档是否被修改过,文档打开的时候设置成ture,当文档被修改,自动被设置为false,该属性由office提供.
	//获取文档控件中打开的文档的文档类型
	switch (OFFICE_CONTROL_OBJ.doctype)
	{
		case 1:
			fileType = "Word.Document";
			fileTypeSimple = "wrod";
			break;
		case 2:
			fileType = "Excel.Sheet";
			fileTypeSimple="excel";
			break;
		case 3:
			fileType = "PowerPoint.Show";
			fileTypeSimple = "ppt";
			break;
		case 4:
			fileType = "Visio.Drawing";
			break;
		case 5:
			fileType = "MSProject.Project";
			break;
		case 6:
			fileType = "WPS Doc";
			fileTypeSimple="wps";
			break;
		case 7:
			fileType = "Kingsoft Sheet";
			fileTypeSimple="et";
			break;
		default :
			fileType = "unkownfiletype";
			fileTypeSimple="unkownfiletype";
	}
	setFileOpenedOrClosed(true);
}

function OnCustomToolBarCommand(btnIdx){
	switch (btnIdx)
	{
		case 0://保存
			saveFileToUrl();
			break;
		case 1://保存到本地
			OFFICE_CONTROL_OBJ.SaveToLocal(ShowDialog(3));
			break;
		case 2://打印
			OFFICE_CONTROL_OBJ.PrintPreview();
			break;
		case 3://隐藏痕迹
			toggleRevisions(btnIdx,4);
			break;
		case 4://显示痕迹
			toggleRevisions(btnIdx,3);
			break;
		case 5://打开文件
			OFFICE_CONTROL_OBJ.OpenLocalFile(ShowDialog(1));
			break;
		case 6://全屏
			toggleFullScreenMode(btnIdx,7);
			break;
		case 7://退出全屏
			toggleFullScreenMode(btnIdx,6);
			break;
		case 8://打开修订
			toggleReviewMode(btnIdx,9);
			break;
		case 9://退出修订
			toggleReviewMode(btnIdx,8);
			break;
		default :
			console.log("没有对应功能！");
	}
}
