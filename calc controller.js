class CalcController {


  constructor() {

    this._LastOperator = " ";
    this._lastNumber = " ";
    this._operation = [];
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._local = "pt-BR";
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();

  }

  pasteFromClipboard() {

    document.addEventListener("paste", e => {

      let text = e.clipboardData.getData("Text")

      if (!isNaN(text))
        this.displayCalc = parseFloat(text)



    })
  }



  copyToclipboard() {
    let input = document.createElement("input")

    input.value = this.displayCalc

    document.body.appendChild(input)

    input.select()

    document.execCommand("Copy")

    input.remove()


  }




  initialize() {

    this.setDisplayDateTime();

    setInterval(() => {

      this.setDisplayDateTime();
    }, 1000);

    this.setLastNumberTodisplay()
    this.pasteFromClipboard()
  }

  initKeyboard() {
    document.addEventListener("keyup", e => {


      switch (e.key) {

        case "Escape":
          this.clearALL();
          break;


        case "Backspace":
          this.clearEntry();
          break;

        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.addOperation(e.key)

        case "Enter":
        case "=":
          this.calc()
          break;

        case ".":
        case ",":
          this.addDot(".")
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key));
          break;

        case "c":
          if (e.ctrlKey) this.copyToclipboard()
          break




      }
    })
  }


  addEventListenerAll(element, events, fn) {

    events.split(" ").forEach(event => {

      element.addEventListener(event, fn, false);

    });
  }

  clearALL() {

    this._operation = []
    this._lastNumber = ""
    this._LastOperator = ""
    this.setLastNumberTodisplay()
  }


  clearEntry() {

    this._operation.pop();

    this.setLastNumberTodisplay()
  }


  getLastOperation() {
    return this._operation[this._operation.length - 1];

  }

  setLastOperation(value) {

    this._operation[this._operation.length - 1] = value
  }


  isOperator(value) {

    return (["+", "-", "*", "%", "/"].indexOf(value) > -1)

  }

  pushOperation(value) {
    this._operation.push(value)

    if (this._operation.length > 3) {



      this.calc()


    }
  }


  getResult() {

    try {
      return eval(this._operation.join(" "))
    }
    catch (e) {
      setTimeout(() => {
        this.setError()
      }, 1)

    }
  }


  calc() {

    let last = ""

    this._LastOperator = this.getLastItem()


    if (this._operation.length < 3) {

      let firstItem = this._operation[0];
      this._operation = [firstItem, this._LastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {

      last = this._operation.pop()
      this._lastNumber = this.getResult()

    }

    else if (this._operation.length == 3) {

      this._lastNumber = this.getLastItem(false)
    }



    let str = this.getResult()
    let res = eval(str)
    if (last == "%") {
      res /= 100

      this._operation = [res]
    }

    else {



      this._operation = [res]

      if (last) this._operation.push(last)


    }
    this.setLastNumberTodisplay()

  }

  getLastItem(isOperator = true) {
    let lastItem = ""

    for (let c = this._operation.length - 1; c >= 0; c--) {



      if (this.isOperator(this._operation[c]) == isOperator) {

        lastItem = this._operation[c]
        break
      }
    }

    if (!lastItem) {
      lastItem = (isOperator) ? this._LastOperator : this._lastNumber
    }

    return lastItem
  }



  setLastNumberTodisplay() {

    let lastNumber = this.getLastItem(false)


    if (!lastNumber) lastNumber = 0

    this.displayCalc = lastNumber
  }




  addOperation(value) {


    if (isNaN(this.getLastOperation())) {

      if (this.isOperator(value)) {

        this.setLastOperation(value)

      }


      else {
        this.pushOperation(value);
        this.setLastNumberTodisplay()
      }
    }
    else {

      if (this.isOperator(value)) {

        this.pushOperation(value);
      }
      else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        this.setLastNumberTodisplay()
      }


    }




    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error"
  }

  addDot() {

    let lastOperation = this.getLastOperation();

    if (typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.")
    }
    else {
      this.setLastOperation(lastOperation.toString() + ".")
    }

    this.setLastNumberTodisplay()
  }


  execBtn(value) {

    switch (value) {

      case "ac":
        this.clearALL();
        break;


      case "ce":
        this.clearEntry();
        break;

      case "soma":
        this.addOperation("+")
        break;

      case "porcento":
        this.addOperation("%")
        break;

      case "divisao":
        this.addOperation("/")
        break;

      case "multiplicacao":
        this.addOperation("*")
        break;

      case "subtracao":
        this.addOperation("-")
        break;

      case "igual":
        this.calc()
        break;

      case "ponto":
        this.addDot(".")
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(parseInt(value));
        break;
      default:
        this.setError()
        break;




    }
  }






  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {

      this.addEventListenerAll(btn, "click drag ", e => {

        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn)
      });
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

        btn.style.cursor = "pointer"
      })


    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._local);
    this.displayTime = this.currentDate.toLocaleTimeString(this._local);
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(valor) {

    if (valor.toString().length > 10) {
      this.setError()
      return false
    }

    this._displayCalcEl.innerHTML = valor;
  }

  get currentDate() {
    return new Date();
  }
  set dataAtual(valor) {
    this._currentDate = valor;
  }
}
