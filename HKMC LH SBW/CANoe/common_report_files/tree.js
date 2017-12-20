
var IMG_DIR = "../common_report_files/";
var PLUS_IMG = IMG_DIR + "btnPlus.gif";
var MINUS_IMG = IMG_DIR + "btnMinus.gif";

var plusImg = new Image();
plusImg.src = PLUS_IMG;
var minusImg = new Image();
minusImg.src = MINUS_IMG;

var localTree = null;

var INDENT_WIDTH = 18;

//creates the tree
function jsTree() 
{
  this.root = null;
  this.nodes = new Array;     //array for all nodes in the tree   
  localTree = this;
}

// Creates root node of the tree
// Returns: new root
// param strIcon: path of image for the root node
// param strText: text for root node
// param hasLink: Should there be a link at the root node?
// param strURL: Link adress
// param strTarget: target for link
// param timestamp: timestamp for the root node 
jsTree.prototype.createRoot = function(strIcon, strText, hasLink, strURL, strTarget, timestamp) 
{    
  this.root = new jsTreeNode(strIcon, strText, hasLink, strURL, strTarget, timestamp);        
  this.root.id = "root"; //assign an ID for internal tracking  
  this.nodes["root"] = this.root; //add node into the array of all nodes    
  this.root.expanded = true;  
  return this.root;
}

//Creates the DOM of the tree
jsTree.prototype.buildDOM = function() 
{
  //call method to add root to document, which will recursively
  //add all other nodes
  this.root.addToDOM(document.body);
}

// Toggles the "expanded"-state of a node
jsTree.prototype.toggleExpand = function(strNodeID) 
{
  //get the node
  var objNode = this.nodes[strNodeID];

  if (objNode.expanded)
  {
    objNode.collapse();
  }
  else
  {
    objNode.expand();
  }
}

// Creates new node
// Returns: new node
// param strIcon: path of image for the node
// param strText: text for node
// param hasLink: Should there be a link at the node?
// param strURL: Link adress
// param strTarget: target for link
// param timestamp: timestamp for the node
function jsTreeNode(strIcon, strText, hasLink, strURL, strTarget, timestamp) 
{
  //Public Properties 
  this.icon = strIcon;
  this.text = strText;
  this.hasLink = hasLink;
  this.url = strURL;
  this.target = strTarget;
  this.timestamp = timestamp;
  this.childNodes = new Array; 
  this.expanded = false;

  //Private Properties 
  this.indent = 0;                    
}


//Adds a new child with the given properties to a node
jsTreeNode.prototype.addChild = function (strIcon, strText, hasLink, strURL, strTarget, timestamp) 
{
  var objNode = new jsTreeNode(strIcon, strText, hasLink, strURL, strTarget, timestamp);    
  objNode.id = this.id + "_" + this.childNodes.length; //assign an ID for internal tracking     
  objNode.indent = this.indent + 1;    
  this.childNodes[this.childNodes.length] = objNode; //add into the array of child nodes 
  localTree.nodes[objNode.id] = objNode; //add it into the array of all nodes
  objNode.parent = this;    
  return objNode;
}


// Adds a node to the DOM of the html page
jsTreeNode.prototype.addToDOM = function (DOMParent)
{
  var linkText
  
  if (this.hasLink)
  {
    //create link
    linkText = "<a href=\"" + this.url + "\" " + "onClick=\"showTimestamp(\'" + this.timestamp + "\')";
    if (this.target)
    {
      linkText += "\" target=\"" + this.target;
    }
    linkText += "\">"
  }
    
  //create the layer for the node
  var nodeDiv = document.createElement("div");
  
  //add it to the DOM parent element
  DOMParent.appendChild(nodeDiv);
  
  //create string buffer
  var d = new jsDocument;
  
  //begin the table - no indentation needed for root and level under root
  if (this.indent > 1) 
  {
    d.write("<table width=\"700\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"  style=\"position:relative; left:");
    d.write((this.indent - 1)*INDENT_WIDTH);
    d.writeln("px\"><tr>");
  }
  else
  { //width=\"700\"
    d.write("<table width=\"700\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" ><tr>");  
  }
 /* //no indent needed for root or level under root
  if (this.indent > 1) 
  {
    d.write("<td width=\"");
    d.write(this.indent * INDENT_WIDTH);
    d.write("\">&nbsp;</td>");
  }
  */
    
  //there is no plus/minus image for the root
  if (this.indent > 0) 
  {
    d.write("<td width=\"18\" align=\"center\">");
    //d.write("<td style=\"{width:18px}\" align=\"center\">");    
    
    //if there are children add a plus/minus image
    if (this.childNodes.length > 0) 
    {
      d.write("<a href=\"javascript:localTree.toggleExpand('");
      d.write(this.id);
      d.write("')\"><img src=\"");
      d.write(this.expanded ? minusImg.src : plusImg.src);
      d.write("\" border=\"0\" hspace=\"1\" id=\"");
      d.write("imgPM_" + this.id);
      d.write("\" /></a>");
    }    
    d.write("</td>");
  }
          
  //finish by drawing the icon and text
  if (this.hasLink)
  {
    //nowrap=\"nowrap\"
    d.write("<td width=\"22\">" +linkText + "<img hspace=\"1\" src=\"" + this.icon + "\" border=\"0\" align=\"absmiddle\" /></a></td>");
    d.write("<td>" + linkText + this.text + "</a></td>");
    d.writeln("</tr></table>");
  }
  else
  {
    d.write("<td width=\"22\">" +"<img hspace=\"1\" src=\"" + this.icon + "\" border=\"0\" align=\"absmiddle\" /></td>");
    d.write("<td>" + this.text + "</td>");
    d.writeln("</tr></table>");      
  }

  //assign the HTML to the layer
  nodeDiv.innerHTML = d;
  
  //create the layer for the children
  var childNodesLayer = document.createElement("div");
  childNodesLayer.setAttribute("id", "divChildren_" + this.id);
  childNodesLayer.style.position = "relative";
  childNodesLayer.style.display = (this.expanded ? "block" : "none");
  nodeDiv.appendChild(childNodesLayer);
  
  // call for all children
  for (var i=0; i < this.childNodes.length; i++)
  {
    this.childNodes[i].addToDOM(childNodesLayer);
  }
}

// Collapses a node
jsTreeNode.prototype.collapse = function () 
{
  if (!this.expanded) 
  {    
    throw "Node is already collapsed"
  } 
  else 
  {    
    this.expanded = false;
    document.images["imgPM_" + this.id].src = plusImg.src;
    
    //hide the child nodes
    document.getElementById("divChildren_" + this.id).style.display = "none";
  }
}

// Expands a node
jsTreeNode.prototype.expand = function () 
{
  if (this.expanded) 
  {
    throw "Node is already expanded"    
  } 
  else
  {
    this.expanded = true;      
    document.images["imgPM_" + this.id].src = minusImg.src;
          
    //show the child nodes
    document.getElementById("divChildren_" + this.id).style.display = "block";
  }
}
