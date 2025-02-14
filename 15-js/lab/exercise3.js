
function signify(text) {
    let list = text.split("");
    
    for (let i = 0; i < list.length; i++) {
        let random = Math.random(0, 1);
        if (random > 0.5) {
            list[i] = list[i].toUpperCase();
        }
    }
    return list.join("");
}

console.log(signify("abcde"));