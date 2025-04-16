export function minMaxCheck(min : number, max: number, price : number) {
    if (min == 0 && max == 0) {
        return price;
    } else {
        const dice0 = Math.random() * 7.5 + 0.1;
        const dice1 = Math.random() * 5.5 + 0.1;
        const dice2 = Math.random() * 4.5 + 0.1;
        const dice3 = Math.random() * 3.5 + 0.1;
        const dice4 = Math.random() * 2.5 + 0.1;
        const dice5 = Math.random() * 1.5 + 0.1;
        const dice6 = Math.random() * 0.5 + 0.1;
        const mainDice = Math.floor(Math.random() * 7);

        const minMax = Math.random() * 0.1 + 0.001;
        const calc = price * minMax;

        if (price < min) {
            return adjustMinLogic(price, calc, mainDice, dice0, dice1, dice2, dice3, dice4, dice5, dice6);
        } else if (price > max) {
            return adjustMaxLogic(price, calc, mainDice, dice0, dice1, dice2, dice3, dice4, dice5, dice6);
        } else {
            return price;
        }
    }
}

function adjustMinLogic(price : number, calc: number, mainDice: number, dice0: number, dice1: number, dice2: number, dice3: number, dice4: number, dice5: number, dice6: number) {
    switch (mainDice) {
        case 0:
            return price += calc * dice0;
        case 1:
            return price += calc * dice1;
        case 2:
            return price += calc * dice2;
        case 3:
            return price += calc * dice3;
        case 4:
            return price += calc * dice4;
        case 5:
            return price += calc * dice5;
        case 6:
            return price += calc * dice6;
        default:
            return price += calc * dice6;
    }
}

function adjustMaxLogic(price : number, calc: number, mainDice: number, dice0: number, dice1: number, dice2: number, dice3: number, dice4: number, dice5: number, dice6: number) {
    switch (mainDice) {
        case 0:
            return price -= calc * dice0;
        case 1:
            return price -= calc * dice1;
        case 2:
            return price -= calc * dice2;
        case 3:
            return price -= calc * dice3;
        case 4:
            return price -= calc * dice4;
        case 5:
            return price -= calc * dice5;
        case 6:
            return price -= calc * dice6;
        default:
            return price -= calc * dice6;
    }
}