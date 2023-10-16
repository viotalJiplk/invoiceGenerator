/**
 * @author Vojtěch Vařecha
 * @version 1.0.0
 * @fileoverview invoice generator
 */

/////////////////////////////////////////////////////
//              Type definition                    //
/////////////////////////////////////////////////////
class Address{
    /**
    * @param {Text} houseNumber 
    * @param {Text} street 
    * @param {Text} city 
    * @param {Text} psc 
    */
    constructor(houseNumber, street, city, psc){
        this.houseNumber = houseNumber;
        this.street = street;
        this.city = city;
        this.psc = psc;
    }
}

class Bank{
    /**
     * 
     * @param {Text} name 
     * @param {Address} address 
     * @param {String} iban
     * @param {String} swift 
     */
    constructor(name, address, iban, swift){
        this.name = name;
        this.address = address;
        this.iban = iban;
        this.swift = swift;
    }
}

class Subject{
    /**
     * Subject of the deal
     * @param {Text} name
     * @param {Address} address
     * @param {Text} ic 
     * @param {Text} dic 
     */
    constructor(name, address, ic, dic){
        this.name = name;
        this.address = address;
        this.ic = ic;
        this.dic = dic;
    }
}

class Dates{
    /**
     * 
     * @param {Date} issueDate 
     * @param {Date} taxableSupplyDate 
     * @param {Date} dueDate 
     */
    constructor(issueDate, taxableSupplyDate, dueDate){
        this.issueDate = issueDate;
        this.taxableSupplyDate = taxableSupplyDate;
        this.dueDate = dueDate;
    }
}

class Payments{
    /**
     * 
     * @param {String} type
     * @param {String} accountNumber
     * @param {String} variableSymbol
     * @param {String} constantSymbol
     * @param {Bank} bank
     */
    constructor(type, accountNumber, variableSymbol, constantSymbol, bank){
        this.type = type;
        this.accountNumber = accountNumber;
        this.variableSymbol = variableSymbol;
        this.constantSymbol = constantSymbol;
        this.bank = bank
    }
}

class Commodity {
    /**
     * 
     * @param {String} name 
     * @param {Number} amount 
     * @param {Number} price 
     */
    constructor(name, amount, price){
        this.name = name;
        this.amount = amount;
        this.price = price;
    }
}

class CommodityCollection{
    finalPrice = 0;
    comodities = [];
    /**
     * 
     * @param {Commodity} commodity 
     */
    addComodity(commodity){
        this.finalPrice += commodity.price * commodity.amount;
        this.comodities.push(commodity);
    }
}

/////////////////////////////////////////////////////
//                  Data extraction                //
/////////////////////////////////////////////////////

const url = new URL(window.location.href);
const contractor = new Subject("Junák - český skaut, Středisko Kuřim, z.s.", new Address("680/7", "Otevřená", "Kuřim", "66434"), "65264657", "");
const customer = new Subject(url.searchParams.get("orgName"), new Address(url.searchParams.get("houseNumber"), url.searchParams.get("street"), url.searchParams.get("city"), url.searchParams.get("PSC")), url.searchParams.get("IC"), url.searchParams.get("DIC"));
const dates = new Dates(new Date(url.searchParams.get("issueDate")),new Date(url.searchParams.get("taxableSupplyDate")),new Date(url.searchParams.get("dueDate")));
const bankTransfer = new Payments("Bankovním převodem", "6980 7302 67/0100", "1302205672", "0001", new Bank("Komerční banka, a.s.", new Address("33/969", "Na Příkopě", "Praha 1", "114 07,"), "CZ88 0100 0000 0069 8073 0267","KOMBCZPPXXX"));
const cash = new Payments("Hotově");
const commodityCollection = new CommodityCollection();

try {
    let addCommodity = JSON.parse(url.searchParams.get("commodity"));
    if(typeof addCommodity === "object" & addCommodity !== null){
        addCommodity.forEach(function(commodity){
            commodityCollection.addComodity(new Commodity(commodity.name, commodity.amount, commodity.price));
        });
    }
} catch(error){
    console.log(error);
}

if(url.searchParams.get("hotovost") === "false"){
    fill("1", contractor, customer, bankTransfer, dates, commodityCollection);
}else{
    fill("1", contractor, customer, cash, dates, commodityCollection);
}

/////////////////////////////////////////////////////
//                  App logic                      //
/////////////////////////////////////////////////////

/**
 * 
 * @param {Number|String} number id
 * @param {Subject} contractor 
 * @param {Subject} odberatel 
 * @param {Payments} payment 
 * @param {Dates} dates 
 * @param {CommodityCollection} commodityCollection 
 */
function fill(number, contractor, customer, payment, dates, commodityCollection){
    document.getElementById("number").innerText = number;
    fillSubject(contractor, document.getElementById("dodavatel"));
    fillSubject(customer, document.getElementById("odberatel"));
    fillPayment(payment, document.getElementById("payment"));
    fillDates(dates, document.getElementById("plneni"));
    fillCommodity(commodityCollection, document.getElementById("zbozi"));
    document.getElementById("fianlPrice").innerText = commodityCollection.finalPrice + " Kč";
}

/**
 * fills subject element
 * @param {Subject} subject data
 * @param {HTMLElement} node subject element to fill
 */
function fillSubject(subject, node){
    setTextOrHideElement(node.querySelector(".name"), subject.name, false);
    setTextOrHideElement(node.querySelector(".address"), subject.address.street + " " + subject.address.houseNumber, false);
    setTextOrHideElement(node.querySelector(".mestoPSC"), subject.address.psc + " " + subject.address.city, false);
    setTextOrHideElement(node.querySelector(".ic"), subject.ic, true);
    setTextOrHideElement(node.querySelector(".dic"), subject.dic, true);
}

/**
 * fills Dates
 * @param {Dates} dates data
 * @param {HTMLElement} node dates element to fill
 */
function fillDates(dates, node){
    /**
     * 
     * @param {Date} date 
     */
    function getDatestring(date){
        return date.getDate() + "." +  (date.getMonth() + 1) + "." + date.getFullYear();
    }
    setTextOrHideElement(node.querySelector(".issueDate"), getDatestring(dates.issueDate), true);
    setTextOrHideElement(node.querySelector(".taxableSupplyDate"), getDatestring(dates.taxableSupplyDate), true);
    setTextOrHideElement(node.querySelector(".dueDate"), getDatestring(dates.dueDate), true);
}

/**
 * fills payment info
 * @param {Payments} payment data
 * @param {HTMLElement} node payment element to fill
 */
function fillPayment(payment, node){
    setTextOrHideElement(node.querySelector(".type"), payment.type, true);
    setTextOrHideElement(node.querySelector(".accountNumber"), payment.accountNumber, true);
    setTextOrHideElement(node.querySelector(".variableSymbol"), payment.variableSymbol, true);
    setTextOrHideElement(node.querySelector(".constantSymbol"), payment.constantSymbol, true);
    if(payment.bank === undefined){
        node.querySelector(".bankInfo").parentElement.style.display = "none";
        node.querySelector(".iban").parentElement.style.display = "none";
        node.querySelector(".swift").parentElement.style.display = "none";
    }else{
        setTextOrHideElement(node.querySelector(".bankInfo").querySelector(".name"), payment.bank.name, false);  
        setTextOrHideElement(node.querySelector(".bankInfo").querySelector(".address"), payment.bank.address.street + " " + payment.bank.address.houseNumber + ", " + payment.bank.address.psc + " " + payment.bank.address.city, false);
        setTextOrHideElement(node.querySelector(".iban"), payment.bank.iban, true);  
        setTextOrHideElement(node.querySelector(".swift"), payment.bank.swift, true);   
    }   
}

/**
 * fills commodity
 * @param {CommodityCollection} collection data 
 * @param {HTMLElement} node comodity element to fill
 */
function fillCommodity(collection, node){
    collection.comodities.forEach(function(commodity){
        node.querySelector("tbody").appendChild(createCommodityDOM(commodity));
    });
}

/**
 * Creates commodity element
 * @param {Commodity} commodity data
 * @returns {HTMLTableRowElement} filled commodity element
 */
function createCommodityDOM(commodity){
    let tr = document.createElement("tr");
    let name = document.createElement("td");
    let amount = document.createElement("td");
    let price = document.createElement("td");
    let finalPrice = document.createElement("td");

    name.innerHTML = commodity.name;
    amount.innerHTML = commodity.amount;
    price.innerHTML = commodity.price + " Kč";
    finalPrice.innerHTML = commodity.amount * commodity.price + " Kč";

    tr.appendChild(name);
    tr.appendChild(amount);
    tr.appendChild(price);
    tr.appendChild(finalPrice);

    return tr;
}


/**
 * Sets innerText of element or hides it or its parent if text=""
 * @param {HTMLElement} element element to fill or hide
 * @param {Text} text text to fill the element with
 * @param {Boolean} hideParent hide parent or self element
 */
function setTextOrHideElement(element, text, hideParent){
    if(text !== "" & text !== undefined & text !== null){
        element.innerText = text;
    }else{
        if(hideParent){
            element.parentElement.style.display = "none";
        }else{
            element.style.display = "none";
        }
    }
}
