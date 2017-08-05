const assignNestedObjectKey = (obj, keyPathArray, value) => {
	const lastKeyIndex = keyPathArray.length-1;
	   for (let i = 0; i < lastKeyIndex; ++ i) {
	     key = keyPathArray[i];
	     if (!(key in obj))
	       obj[key] = {}
	     obj = obj[key];
	   }
   	obj[keyPathArray[lastKeyIndex]] = value;
}