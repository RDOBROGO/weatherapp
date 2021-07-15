const _getDOMElem = id => {
    return document.getElementById(id);
}

export const mapListToDOMElements = listOfId => {
    const _viewElems = {};

    for (const id of listOfId) {
        _viewElems[id] = _getDOMElem(id);
    }
    return _viewElems;
}

export const createDomElements = (element, className) => {
    const domElement = document.createElement(element);
    domElement.classList.add(className);
    return domElement;
}
