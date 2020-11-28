//{x: 5, y: 5, width: 50, height: 50}

export function collision(obj1, obj2)
const rect1 = (obj1 typeof HTMLElement) ? getRect(obj1) : obj1;
const rect2 = (obj2 typeof HTMLElement) ? getRect(obj2) : obj2;

if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    return true
}
return false;
}


export function getRect(obj) {
    return {
        x: obj.clientLeft,
        y: obj.clientTop,
        width: obj.offsetWidth,
        height: obj.offsetHeight
    }
}