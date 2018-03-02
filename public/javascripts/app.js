$(document).foundation()

function fromEm(em) {
    return parseFloat(em.substring(0, em.length - 2));
}

function toEm(em) {
    return em.toString() + "em";
}

function resizeUp(object) {
    if (!object.style.width) {
        object.style.minWidth="8em";
        object.style.width="8em";
        object.style.maxWidth="9em";
    }
    if (object.downsizeId) clearInterval(object.downsizeId);
    object.upsizeId = setInterval(function() {
        width = fromEm(object.style.width);
        maxWidth = fromEm(object.style.maxWidth);
        object.style.width = toEm(width + 0.08 * (maxWidth - width)); 
    }, 10);
}

function resizeDown(object) {
    if (!object.style.width) {
        object.style.minWidth="8em";
        object.style.width="8em";
        object.style.maxWidth="9em";
    }
    if (object.upsizeId) clearInterval(object.upsizeId);
    object.downsizeId = setInterval(function() {
        width = fromEm(object.style.width);
        minWidth = fromEm(object.style.minWidth);
        object.style.width = toEm(width - 0.08 * (width - minWidth)); 
    }, 10);
}