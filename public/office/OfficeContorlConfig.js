var OFFICE_CONTROL_OBJ;//控件对象
var IsFileOpened;      //控件是否打开文档
var isPublish=false;//是否部署
var fileType ;
var fileTypeSimple;
var host = "http://"+window.location.host;
var projectName = "/portal";
/**
 * 页面加载事件
 * @param fileUrl
 */
function init()
{
  console.log(host);
  console.log(fileId);
  OFFICE_CONTROL_OBJ = document.getElementById("TANGER_OCX");
  initObjConfig();//加载配置
  AddCustomToolBar();//加载工具栏内容
  if(isNull(fileId)){//fileId不为空
    ntkoCreateNew('wps.document');//id为空，则创建新
    fileId = guid();
  }else{
    NTKO_OCX_OpenDoc(getFileUrl(fileId));//加载需要打开的文件
  }
  console.log(fileId);
  setFileOpenedOrClosed(true);
}
/**
 * 页面加载配置
 */
function initObjConfig(){
  OFFICE_CONTROL_OBJ.Menubar=false;//不显示菜单
  OFFICE_CONTROL_OBJ.Statusbar=!isPublish;//不显示底部信息栏ss
  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(8,false,false);//【关闭全屏】按钮禁用
  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(10,false,false);//【关闭修订】按钮禁用
}

/**
 * 增加菜单选项
 */
function AddCustomToolBar()
{
  OFFICE_CONTROL_OBJ.AddCustomToolButton("保存", 3,1);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("保存到本地", 4,2);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("打印", 5,3);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("显示痕迹", 9,4);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("隐藏痕迹", 9,5);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("打开文件", 10,6);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("全屏", 10,7);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("退出全屏", 10,8);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("打开修订", 10,9);
  OFFICE_CONTROL_OBJ.AddCustomToolButton("关闭修订", 9,10);

  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(8,false,false);//【关闭全屏】按钮禁用
  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(10,false,false);//【关闭修订】按钮禁用
}
/**
 * 按钮事件触发
 * @param menuPos
 */
function OnCustomToolBarCommand( menuPos )
{

  console.log("CustomToolBarCommand" + menuPos );
  console.log("文档打开情况："+OFFICE_CONTROL_OBJ.DocType);
  if( 1 == menuPos )//保存
    saveFileToUrl();
  else if( 2 == menuPos )//保存到本地
    SaveToLocal();
  else if( 3 == menuPos )//打印
    printwps();
  else if( 4 == menuPos )//显示痕迹
    showRevision(0);
  else if( 5 == menuPos ) //隐藏痕迹
    showRevision(0);
  else if( 6 == menuPos )//打开文件
    ntkoOpenLocal();
  else if( 7 == menuPos )//全屏
    toggleFullScreenMode(7,8);
  else if( 8 == menuPos )//退出全屏
    toggleFullScreenMode(8,7);
  else if( 9 == menuPos )//打开修订
    toggleTrackRevisions(9,10);
  else if( 10 == menuPos )//关闭修订
    toggleTrackRevisions(10,9);
}
/**
 * 页面关闭事件，查看是否当前文档有被保存（后续可以利用到页面切换过程中）
 */
function onPageClose()
{
  if(!OFFICE_CONTROL_OBJ.activeDocument.saved)
  {
    if(confirm( "在线编辑文档修改过,还没有保存,是否需要保存?"))
    {
      saveFileToUrl();
    }
  }
}
/**
 * 页面基本变量
 */
function setFileOpenedOrClosed(bool)
{
  IsFileOpened = bool;
  fileType = OFFICE_CONTROL_OBJ.DocType;
}
/**************************方法*****************************/
/**
 * 创建文件
 */
function ntkoCreateNew(type)
{
  OFFICE_CONTROL_OBJ.CreateNew(type);
}

function SaveToLocal()
{
  OFFICE_CONTROL_OBJ.SaveToLocal("",false,true);
}
//打印文档
function printwps()
{
  OFFICE_CONTROL_OBJ.PrintOut(true);
}
/**
 * 显示/隐藏痕迹
 * @param val
 */
function showRevision(val)
{
  OFFICE_CONTROL_OBJ.showRevision(val);
}
/**
 * 打开本地文件
 */
function ntkoOpenLocal()
{
  OFFICE_CONTROL_OBJ.OpenLocalFile("");
}
/**
 * 切换全屏状态
 */
function toggleFullScreenMode(closeIndex,openIndex){
  OFFICE_CONTROL_OBJ.FullScreenMode = !OFFICE_CONTROL_OBJ.FullScreenMode;
  toggleCustomToolButtonStatus(closeIndex,openIndex);
}
/**
 * 切换修订
 */
function toggleTrackRevisions(closeIndex,openIndex){
  OFFICE_CONTROL_OBJ.enableRevision(!OFFICE_CONTROL_OBJ.ActiveDocument.TrackRevisions);
  toggleCustomToolButtonStatus(closeIndex,openIndex);
}
/**
 * 根据地址打开文件
 */
function NTKO_OCX_OpenDoc(fileUrl)
{
  OFFICE_CONTROL_OBJ.BeginOpenFromURL(fileUrl);
}
/**
 * 切换互斥显示按钮状态
 */
function toggleCustomToolButtonStatus(closeIndex,openIndex){
  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(closeIndex,false,false);
  OFFICE_CONTROL_OBJ.SetCustomToolButtonStatus(openIndex,true,true);
}
/**
 * 获取文件下载的url
 */
function getFileUrl(fileId){
  //var url ="/download.jsp?fileId="+fileId;
  var url ="/api/fileInfos/download";
  let fileUrl = host + url + '?id=' + fileId + '&access_token=' + encodeURI(token);
  console.log(fileUrl);
  return fileUrl;
}
//上传附件
function saveFileToUrl()
{

  var uploadUrl ="/api/fileInfos/saveFile";
  var myUrl = host + uploadUrl + '?access_token=' + encodeURI(token);
  var fileName = fileId + '.doc';
  var result;
  if(IsFileOpened)
  {
    console.log(OFFICE_CONTROL_OBJ.doctype);
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
      "file",//文件域的id，类似<input type=file id=upLoadFile 中的id
      "type="+fileType + "&identifier="+ new Date().getTime() +"&totalSize=2222323" + "&filename="+fileName + `&id=${fileId}`,         //与控件一起提交的参数如："p1=a&p2=b&p3=c"
      fileName,    //上传文件的名称，类似<input type=file 的value
      0    //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    );
    // document.all("statusBar").innerHTML="服务器返回信息:" + result;
    alert(result);
    // window.close();
    return result;
  }
}


/****************************工具类**********************************/
function isNull(obj){
  var flag=false;
  if(obj==undefined||obj==null||!obj){
    flag=true;
  }else{
    if(obj==''||obj=='null'||obj=='undefined'){
      flag=true;
    }
  }
  return flag;
}
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function getIpAndPort(){
  var curPath = window.document.location.href;
  var pathname = window.document.location.pathname;
  var pos = curPath.indexOf(pathname);
  var localhostPath = curPath.substring( 0, pos );
  return localhostPath;
}
