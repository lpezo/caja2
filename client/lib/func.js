Meteor.Util = {
	strFormat: function(pStr){
		let pos = pStr.indexOf('.');
		if (pos > 0)
		{
			return (pStr.trim() + "00").substring(0, pos+3);

		}
		else
			return pStr.trim() + ".00";
	}
}