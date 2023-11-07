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
};

export function getCurrency(money: number | bigint) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    style: "currency",
  }).format(money); // 'CA$ 100.00'
}

export function getMoney(amount:  string) {
  return parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}