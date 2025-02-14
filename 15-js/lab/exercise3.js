
function signify(text, p=0.3) {
    let list = text.split("");
    for (let i = 0; i < list.length; i++) {
        if (p > 0.5) {
            list[i] = list[i].toUpperCase();
        }
    }
    return list.join("");
}

console.log(signify("abcde", 0.6));