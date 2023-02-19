export const generateId = () => {
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let res = "";
    for(let i = 0; i < 2; i++) {
        let rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }

    for(let i = 0; i < 4; i++) {
        res = res + String(Math.floor(Math.random() * 9));

    }
    return res;
}

