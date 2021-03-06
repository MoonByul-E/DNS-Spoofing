/**
 * [placeholder.js]
 * Let working "placeholder" in Internet Explorer 9 lte
 *
 * @version 1.1.4
 * @author prevdev@gmail.com
 *
 * source code in https://github.com/Prev/placeholderjs
 * built in 2013.11.16
 *
 * MIT LICENSE
 */

(function (d) {
	var PLACE_HOLDER_COLOR = "#aaa";
	var domBodyInnerHTML;

	function isPlaceholderSupport() {
		var input = document.createElement('input');
		return ('placeholder' in input);
	}

	function initPlaceholder() {
		var inputs = d.getElementsByTagName('input');
		var textareas = d.getElementsByTagName('textarea');
		var i;

		for (i=0; i<inputs.length; i++)
			setPlaceHolder(inputs[i]);

		for (i=0; i<textareas.length; i++)
			setPlaceHolder(textareas[i]);

		if (!isPlaceholderSupport()) {
			setInterval(intervalHandler, 20);
		}
	}

	function intervalHandler() {
		if (domBodyInnerHTML != d.body.innerHTML) {
			initPlaceholder();
			domBodyInnerHTML = d.body.innerHTML;
		}
	}

	function setPlaceHolder(inputText) {
		var placeholder;
		
		if ((inputText.type != "text" && inputText.type != "password" && inputText.nodeName.toLowerCase() != "textarea") || (inputText.placeholder && isPlaceholderSupport())) return;
		if (inputText.getAttribute('isPlaceHolderInited')) return;

		if (inputText.getAttribute('placeholder'))
			placeholder = inputText.getAttribute('placeholder');
		else {
			var matches = inputText.outerHTML.match(/placeholder=("([^"]*)"|[^\s>]*)/);
			if (matches && matches[2])
				placeholder = matches[2];
			else if (matches && matches[1])
				placeholder = matches[1];

			if (placeholder)
				inputText.setAttribute('placeholder', placeholder);
		}

		inputText.setAttribute('isPlaceHolderInited', true);

		if (!placeholder) return;

		inputText.setAttribute('originalColor', inputText.style.color);


		if (inputText.type == "text" || inputText.nodeName.toLowerCase() == "textarea") {
			inputText.style.fontWeight = 'normal';
			if (!inputText.value) {
				inputText.value = placeholder;
				inputText.style.color = PLACE_HOLDER_COLOR;
				inputText.setAttribute('isPlaceholdered', true);
			}

			if (inputText.addEventListener) {
				inputText.addEventListener("focus", placeholderFocusHandler);
				inputText.addEventListener("blur", placeholderBlurHandler);

			}else if (inputText.attachEvent) {
				inputText.attachEvent("onfocus", placeholderFocusHandler);
				inputText.attachEvent("onblur", placeholderBlurHandler);

			}else {
				inputText.onfocus = placeholderFocusHandler;
				inputText.onblur = placeholderBlurHandler;
			}
		}else if (inputText.type == "password") {
			var randInputId = Math.floor(Math.random()*100000);

			var fakeInputText = d.createElement("input");
			fakeInputText.className = inputText.className + " _fake-placeholder-" + randInputId;
			fakeInputText.type = "text";
			fakeInputText.value = placeholder;
			

			for (var i in inputText.style) {
				if (inputText.style[i]) {
					fakeInputText.style[i] = inputText.style[i];
				}
			}
			fakeInputText.style.color = PLACE_HOLDER_COLOR;
			fakeInputText.style.fontWeight = 'normal';
			inputText.className += " _placeholder-" + randInputId;
			inputText.style.display = "none";
			inputText.parentElement.insertBefore(fakeInputText, inputText);

			if (inputText.className.substr(0, 1) == " ")
				inputText.className = inputText.className.substr(1, inputText.className.length);

			if (fakeInputText.className.substr(0, 1) == " ")
				fakeInputText.className = fakeInputText.className.substr(1, fakeInputText.className.length);


			fakeInputText.setAttribute("randInputId", randInputId);
			inputText.setAttribute("randInputId", randInputId);

			if (fakeInputText.addEventListener) {
				fakeInputText.addEventListener("focus", passwordPlaceHolderFocusHandler);
				inputText.addEventListener("blur", passwordPlaceHolderBlurHandler);

			}else if (fakeInputText.attachEvent) {
				fakeInputText.attachEvent("onfocus", passwordPlaceHolderFocusHandler);
				inputText.attachEvent("onblur", passwordPlaceHolderBlurHandler);

			}else {
				fakeInputText.onfocus = passwordPlaceHolderFocusHandler;
				inputText.onblur = passwordPlaceHolderBlurHandler;
			}
		}

	}

	function placeholderFocusHandler(event) {
		var target = event.srcElement || this;
		if (target.getAttribute('isPlaceholdered') && target.getAttribute('isPlaceholdered') != "false") {
			target.value = "";
			target.style.color = target.getAttribute('originalColor');
			target.style.fontWeight = '';
			target.setAttribute('isPlaceholdered', false);
		}
	}

	function placeholderBlurHandler(event) {
		var target = event.srcElement || this;
		if (target.value == "") {
			target.value = target.getAttribute('placeholder');
			target.style.color = PLACE_HOLDER_COLOR;
			target.style.fontWeight = 'normal';
			target.setAttribute('isPlaceholdered', true);
		}else
			target.setAttribute('isPlaceholdered', false);
	}

	function passwordPlaceHolderFocusHandler(event) {
		var target = event.srcElement || this;
		
		var randInputId = target.getAttribute('randInputId');
		var realInputText = d.getElementsByClassName("_placeholder-" + randInputId)[0];
		
		target.style.display = "none";
		realInputText.style.display = "inline";
		realInputText.focus();
	}

	function passwordPlaceHolderBlurHandler(event) {
		var target = event.srcElement || this;
		
		if (target.value == "") {
			var randInputId = target.getAttribute('randInputId');
			var fakeInputText = d.getElementsByClassName("_fake-placeholder-" + randInputId)[0];
			
			fakeInputText.style.display = "inline";
			target.style.display = "none";
		}
	}

	if (!d.getElementsByClassName) {
		if (d.querySelectorAll) {
			d.getElementsByClassName = function (className) {
				return d.querySelectorAll("." + className);
			}
		}else if (d.getElementsByTagName) {
			d.getElementsByClassName = function (className) {
				var t = d.getElementsByTagName("input");
				var arr = [];
				for (var i=0; i<t.length; i++){
					var classLists = t[i].className.split(" ");
					if (classLists.indexOf(className) != -1)
						arr.push(t[i]);
				}
				return arr;
			}
		}
	}

	function NodeList(length) {
		if (length) {
			for (var i=0; i<length; i++)
				this[i] = 0;
			this.length = parseInt(length);
		}else
			this.length = 0;
	}
	NodeList.prototype = {
		item: function (index) {
			return this[index];
		},
		__push: function(node) {
			var __index = this.length;
			this[__index] = node;
			this.length++;
		},
		toString: function() {
			return "[object NodeList]";
		}
	};
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement, fromIndex) { if (!fromIndex) fromIndex = 0; for (var i=fromIndex; i<this.length; i++) { if (this[i] === searchElement) return i; } return -1; }
	}

	if (window.addEventListener)
		window.addEventListener('load', initPlaceholder);
	else if (window.attachEvent)
		window.attachEvent('onload', initPlaceholder);

})(document);