class DOMTemplate {
    static get oderBy() {
        return {
            ASC: 0,
            DESC: 1
        }
    }
    static bind(element, dataSource) {
        try {
            if (null === element.attributes || void 0 === element.attributes["data-app-option"])
                return
        } catch (exp) {
            return
        }
        let optVlu = element.attributes["data-app-option"].value.replaceAll("'", '"');
        element.removeAttribute("data-app-option");
        let dataOpt = JSON.parse(optVlu);
        for (let propName in dataOpt) element[propName] = dataSource[dataOpt[propName]];
    }
    static traversalBind(node, dataSource) {
        let nodeLength = node.childNodes.length;
        if (nodeLength > 0) {
            for (let i = 0; i < nodeLength; i++) {
                this.traversalBind(node.childNodes[i], dataSource);
            }
        }
        this.bind(node, dataSource);
    }
    static bindTemplate(targetDiv, dataSources, oderBy) {
        let tpl = document.getElementById(targetDiv.attributes['data-template'].value).content;
        if (dataSources.length) {
            let dataLength = dataSources.length;
            for (let i = 0; i < dataLength; i++) {
                let clone = tpl.cloneNode(true);
                this.traversalBind(clone, dataSources[i]);
                targetDiv.appendChild(clone);
            }
        } else {
            let clone = tpl.cloneNode(true);
            this.traversalBind(clone, dataSources);
            if (oderBy === this.oderBy.DESC) {
                targetDiv.insertBefore(clone, targetDiv.firstChild);
            } else {
                targetDiv.appendChild(clone);
            }
        }
    }
    static applyTemplate(targetDiv, templateName) {
        const tpl = document.getElementById(templateName).content;
        const clone = tpl.cloneNode(true);
        targetDiv.appendChild(clone);
    }

    static deleteChildrenNodeAll(parent) {
        for (; parent.firstChild;)
            parent.removeChild(parent.lastChild)
    }
}