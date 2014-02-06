function add(x)
{
	return x.reduce(function(x, y){return x+y});
}

function zeros(n)
{
	return arrayValue(n, 0);
}
function arrayValue(n, val)
{
	return _.range(n).map(function(x){return val;});
}