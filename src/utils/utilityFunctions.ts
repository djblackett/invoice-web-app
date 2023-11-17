export const generateId = () => {
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for(let i = 0; i < 2; i++) {
    const rnd = Math.floor(Math.random() * list.length);
    res += list.charAt(rnd);
  }

  for(let i = 0; i < 4; i++) {
    res += String(Math.floor(Math.random() * 9));
  }
  return res;
};

export function getCurrency(money: number | bigint) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    style: "currency",
  }).format(money); // 'CA$ 100.00'
}

export function getMoney(amount:  number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export const convertedDate = (dateString: string) => {
  if (dateString) {
    const date = dateString.split("-");
    const dateObj = new Date(Date.UTC(Number(date[0]), Number(date[1]), Number(date[2])));
    return dateObj.toDateString().substring(4);
  }
};