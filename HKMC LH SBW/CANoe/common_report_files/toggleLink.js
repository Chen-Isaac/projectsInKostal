var toggledDisplay = new Object();
var displayed = new Object();
var tmpTextmarkID = 'zzzz';
var tmpTextmarkSemaphore = false;
displayed['true'] = 'table-row';
displayed['false'] = 'none';

function setTextmarkSemaphore(bValue){
   tmpTextmarkSemaphore = bValue;
   tmpTextmarkID = 'zzzz';
}

function toggleInitializeAlllExt(tagName)
{
	var trs = document.getElementsByTagName(tagName);
 	for  (var i = 0; i < trs.length; i++) 
	{
		var currentID = trs[i].id;
		if (currentID != "")   
		{
			toggledDisplay[currentID] = true;
		}
	}
}


function toggleInitializeAlll()
{
	toggleInitializeAlllExt('tr')
}

function toggleExpandCollapseAllExt(bExpand, verdict)
{
	var trs = document.getElementsByTagName('tr');
	if(verdict == 'all'){
	  if(trs.length > 0){ tmpTextmarkID = trs[0].id; }
	  for (var i=0; i<trs.length; i++)
	  {
	    if (trs[i].id != "" ) 
	    {
	  	 toggleDisplayExt(trs[i].id,bExpand);
	    }
	  }
          self.location.hash ='#'+tmpTextmerkID;
	}
	else if(verdict == 'passed'){
	  for (var i=0; i<trs.length; i++)
	  {
	    var currentID = trs[i].id;
	    if (currentID != "")  
	    {
	      var result = currentID.match(/_pass$/);
	      if(result){
	  	toggleDisplayExt(currentID,bExpand);
		if(tmpTextmarkSemaphore && (currentID < tmpTextmarkID)){ tmpTextmarkID = currentID; }
	      }
 		
	    }
	  }
	}
	else if(verdict == 'failed'){
	  for (var i=0; i<trs.length; i++)
	  {
	    var currentID = trs[i].id;
	    if (currentID != "")  
	    {
	      var result = currentID.match(/_fail$/);
	      if(result){
	  	toggleDisplayExt(currentID,bExpand);
		if(tmpTextmarkSemaphore && (currentID < tmpTextmarkID)){ tmpTextmarkID = currentID; }
	      }
 		
	    }
	  }
	}
	else if(verdict == 'warn'){
	  for (var i=0; i<trs.length; i++)
	  {
	    var currentID = trs[i].id;
	    if (currentID != "")  
	    {
	      var result = currentID.match(/_warn$/);
	      if(result){
	  	toggleDisplayExt(currentID,bExpand);
		if(tmpTextmarkSemaphore && (currentID < tmpTextmarkID)){ tmpTextmarkID = currentID; }
	      }
 		
	    }
	  }
	}
	else if(verdict == 'selfDesc'){
	  for (var i=0; i<trs.length; i++)
	  {
	    var currentID = trs[i].id;
	    if (currentID != "")  
	    {
	      var result = currentID.match(/_selfDesc$/);
	      if(result){
	  	toggleDisplayExt(currentID,bExpand);
	      }
 		
	    }
	  }
	}
	else if(verdict == 'parentDesc'){
	  for (var i=0; i<trs.length; i++)
	  {
	    var currentID = trs[i].id;
	    if (currentID != "")  
	    {
	      var result = currentID.match(/_parentDesc$/);
	      if(result){
	  	toggleDisplayExt(currentID,bExpand);
	      }
 		
	    }
	  }
	} 	
	
	if(tmpTextmarkID != "zzzz") {self.location.hash = '#'+tmpTextmarkID;}
}

function toggleExpandCollapseAll(bExpand, verdict)
{
	toggleExpandCollapseAllExt(bExpand, verdict);
}

function toggleDisplayExt(trid, bDisplayed)
{
	var rows = document.getElementsByName(trid);

	for(var x = 0; x < rows.length; x++)
  	{
		oDisplay = rows[x];
	
		if(oDisplay != null)
   	    {
     
		  oDisplay.style.display = displayed[bDisplayed];
		  if (bDisplayed)
		  {
			oImages = oDisplay.getElementsByTagName('IMG');
			for (var j = 0; j < oImages.length; j++)
			{
			  oImages[j].src = oImages[j].src;
			}
		  }
		
		  if (typeof toggledDisplay[trid] != 'undefined')
		  {
			toggledDisplay[trid] = !bDisplayed;
	  	}
		}
	}
}

function toggleDisplay(bDisplayed)
{
  if(!document.getElementsByName || toggleDisplay.arguments.length < 2)
  {
    return;
  }
	
  for(var i = 1; i < toggleDisplay.arguments.length; i++)
  {
	  toggleDisplayExt(toggleDisplay.arguments[i],bDisplayed);
  }
}	

function showTimestamp(timestamp)
{
       var success = top.LogFile.showTimestamp(timestamp);
}        
	