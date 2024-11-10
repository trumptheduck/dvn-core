export function isArrayEmpty(reference) {
    try {
        return !(Array.isArray(reference)&&reference.length > 0);
    } catch (error) {
        return false;
    }
}
export function isStringEmpty(string: any) {
    try {
        return !(typeof string == "string"&&string.length > 0)
    } catch (error) {
        return false;
    }
}

export function onlyWithin(value: string, compareWith: string[]):boolean {
    return compareWith.indexOf(value) !== -1;
}

export function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

export function subtractArray(a, b) {
    return a.filter(n => !b.includes(n))
}
export function shuffleArray<T>(array:T[]): T[] {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }