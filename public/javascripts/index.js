function fromPx(px) {
	return parseFloat(px);
}

function toPx(px) {
	return px + "px";
}

var resize_coeff = 0.08;
var update_interval = 6;

function resizeUp(object) {
  if (object.downsizeId) clearInterval(object.downsizeId);

	style = getComputedStyle(object);
	object.upsizeId = setInterval(function() {
		width = fromPx(style.width);
		maxWidth = fromPx(style.maxWidth);
		if (Math.abs(maxWidth - width) <= 1) {
			object.style.width = toPx(maxWidth);
			clearInterval(object.upsizeId);
			return;
		}
		object.style.width = toPx(width + resize_coeff * (maxWidth - width));
	}, update_interval);
}

function resizeDown(object) {
	if (object.upsizeId) clearInterval(object.upsizeId);

	style = getComputedStyle(object);
	object.downsizeId = setInterval(function() {
		width = fromPx(style.width);
		minWidth = fromPx(style.minWidth);
		if (Math.abs(minWidth - width) <= 1) {
			object.style.width = toPx(minWidth);
			clearInterval(object.downsizeId);
			return;
		}
		object.style.width = toPx(width + resize_coeff * (minWidth - width));
	}, update_interval);
}

$(function() {
	$(".table-img").map(function() {
		this.onmouseover = resizeUp.bind(null, this);
		this.onmouseout = resizeDown.bind(null, this);
	});
});