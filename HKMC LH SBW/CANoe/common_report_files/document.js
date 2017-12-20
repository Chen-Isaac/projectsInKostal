
function jsDocument() 
{
	this.text = new Array();		//array to store the string
	this.write = function (str) { this.text[this.text.length] = str; }
	this.writeln = function (str) { this.text[this.text.length] = str + "\n"; }
	this.toString = function () { return this.text.join(""); }
	this.clear = function () { delete this.text; this.text = null; this.text = new Array; }
}
