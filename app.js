class HTMLNode {
    constructor(tag="", attributes=[], content=""){
        this.tag = tag
        this.attributes = attributes
        this.content = content
        this.children = []
        this.parent = undefined
    }

    addChild(child){
        this.children.push(child)
        this.children[this.children.length - 1].setParent(this)
    }

    setParent(parent){
        this.parent = parent
    }

    getLastChild(){
        if(this.children.length >0){
            return this.children[this.children.length - 1]
        }
        return undefined
    }

    getChildren(){
        return this.children
    }

    getTag(){
        return this.tag
    }

    getAttributes(){
        return this.attributes
    }

    getContent(){
        return this.content
    }

    getParent(){
        return this.parent
    }
}

class HTMLTree{
    constructor(){
        this.root = new HTMLNode()
        this.currentNode = this.root
        this.html = ""
    }

    add(node){
        this.currentNode.addChild(node)
    }

    goDown(){
        this.currentNode = this.currentNode.getLastChild()
    }

    goUp(){
        this.currentNode = this.currentNode.getParent()
    }

    createHTML(){
        this.html = ""
        //this.traverseTree(this.root.getChildren()[0])
        this.traverseTree(this.root.getChildren()[0].getChildren()[0], 1)
        this.traverseTree(this.root.getChildren()[0].getChildren()[1], 1)
        return this.html
    }

    traverseTree(node, depth=0){
        //console.log(depth)
        if(node == null){
            return
        }
        if(node.getAttributes() == null && node.getChildren() == null && node.getContent() == null){
            return 
        }

        let new_line = "\n"
        let tab = "\t"

        for(var i = 0; i < depth; i++){
            this.html += "\t"
        }
        this.html += `<${node.tag} `
        
        if(node.getAttributes() != null){
            let attributes = node.getAttributes()
        
            for(var i = 0; i < attributes.length; i++){
                if(attributes[i][0] == "."){
                    this.html += `class="${attributes[i].substring(1)}" `
                }
                else if(attributes[i][0] == "#"){
                    this.html += `id="${attributes[i].substring(1)}" `
                }
                else{
                    this.html += attributes[i] + " "
                }
            }
        }
        this.html += ">" + new_line

        let htmlChildren = node.getChildren()
        for(var i = 0; i < htmlChildren.length; i++){
            if(htmlChildren[i].getTag() == ""){
                for(var j = 0; j < depth; j++){
                    this.html += "\t"
                }
                this.html += `${htmlChildren[i].getContent()} ${new_line}`
            }
            else{
                this.traverseTree(htmlChildren[i], depth+1)
            }
        }
        for(var i = 0; i < depth; i++){
            this.html += "\t"
        }
        this.html += `</${node.getTag()}>${new_line}`
    }

}

function isTagLine(line){
    return line.length >= 2 && line[line.length - 1] == ":" && line[line.length - 2] != "\\:"
}

function gcd(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
        return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function GCD(numbers){
    numbers.sort((a, b) => a - b)

    if(numbers.length == 0){
        return undefined
    }
    else if(numbers.length == 1){
        return numbers[0]
    }
    else if(numbers.length == 2){
        return gcd(numbers[0], numbers[1])
    }

    gcd_ = gcd(numbers[0], numbers[1])
    for(var i = 2; i < numbers.length; i++){
        gcd_ = gcd(gcd_, numbers[i])
    }

    return gcd_
}

function createNodeFromLine(line){
    tagAndAttributes = line.split(" ")
    return new HTMLNode(tagAndAttributes[0], tagAndAttributes.slice(1))
}

if(new URL(window.location).pathname.endsWith(".piml")){
    let htmlTree = new HTMLTree()

    //alert(document.body.children[0].innerHTML)

    var lines = document.body.children[0].innerHTML.split("\n")
    for(var i = 0; i < lines.length; i++){
        lines[i] = lines[i].trimEnd()
    }
    //console.log(lines)

    var leadingSpaces = []
    for( line of lines){
        leadingSpaces.push(line.length - line.trimStart().length)
    }
    //console.log(leading_spaces)

    let usedIndentation = GCD(leadingSpaces)
    
    var indentationLinePair = []
    for( line of lines){
        indentationLinePair.push([(line.length - line.trimStart().length) / usedIndentation, line.trim()])
    }
    //console.log(indentationLinePair)

    var currentIndentation = 0
    for( pair of indentationLinePair){
        if(isTagLine(pair[1])){
            if(pair[0] == currentIndentation){
                currentIndentation++
                htmlTree.add(createNodeFromLine(pair[1].substring(0, pair[1].length - 1)))
                htmlTree.goDown()
            }
            else if(pair[0] < currentIndentation){
                for(var i = 0; i < currentIndentation - pair[0]; i++){
                    htmlTree.goUp()
                }
                htmlTree.add(createNodeFromLine(pair[1].substring(0, pair[1].length - 1)))
                htmlTree.goDown()
                currentIndentation = pair[0] + 1
            }
        }
        else{
            if(pair[0] == currentIndentation){
                htmlTree.add(new HTMLNode("", [], pair[1].replace("\\", "")))
            }
            else if(pair[0] < currentIndentation){
                for(var i = 0; i < currentIndentation - pair[0]; i++){
                    htmlTree.goUp()
                }
                htmlTree.add(new HTMLNode("", [], pair[1].replace("\\", "")))
                currentIndentation = pair[0]
            }
        }
    }
    console.log(htmlTree)
    console.log(htmlTree.createHTML())
    document.documentElement.innerHTML = htmlTree.createHTML()

}
//alert(new URL(window.location).pathname.endsWith(".piml"))

