const minPerDay = 2500;

document.getElementById("hotovost").checked = true;
document.getElementById("submit").addEventListener("click", submit);

function submit(){
    let url = new URL("./invoice.html", location.href)
    let pocetOsob = document.getElementById("pocetOsob").value;
    let pocetDni = document.getElementById("pocetDni").value;
    let ubytovani = [];

    if (pocetOsob*pocetDni*90 < pocetDni * minPerDay){
        ubytovani.push({
            "name": "Ubytování",
            "amount": pocetDni,
            "price": minPerDay
        });
    }else{
        ubytovani.push({
            "name": "Ubytování",
            "amount": pocetDni*pocetOsob,
            "price": 90
        });
    }

    // list of all avalible url params
    // unset parameters fields will be hidden in the invoice
    url.searchParams.append("issueDate", document.getElementById("issueDate").value);
    url.searchParams.append("taxableSupplyDate", document.getElementById("taxableSupplyDate").value);
    url.searchParams.append("dueDate", document.getElementById("dueDate").value);
    url.searchParams.append("commodity", JSON.stringify(ubytovani));
    url.searchParams.append("hotovost", document.getElementById("hotovost").checked);
    url.searchParams.append("orgName", document.getElementById("orgName").value);
    url.searchParams.append("houseNumber", document.getElementById("houseNumber").value);
    url.searchParams.append("street", document.getElementById("street").value);
    url.searchParams.append("city", document.getElementById("city").value);
    url.searchParams.append("PSC", document.getElementById("PSC").value);
    url.searchParams.append("IC", document.getElementById("IC").value);
    url.searchParams.append("DIC", document.getElementById("DIC").value);
    location.href = url.href;
}