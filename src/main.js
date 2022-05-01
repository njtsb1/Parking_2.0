var ParkingFront = /** @class */ (function () {
    function ParkingFront($, parking) {
        if (parking === void 0) { parking = new Parking(); }
        this.$ = $;
        this.parking = parking;
    }
    ParkingFront.prototype.add = function (car, save) {
        if (save === void 0) { save = false; }
        this.parking.add(car);
        var row = document.createElement("tr");
        row.innerHTML = "\n                <td>" + car.name + "</td>\n                <td>" + car.plate + "</td>\n                <td data-time=\"" + car.prohibited + "\">\n                    " + car.prohibited.toLocaleString("pt-BR", {
            hour: "numeric",
            minute: "numeric"
        }) + "\n                </td>\n                <td>\n                    <button class=\"delete\">x</button>\n                </td>\n            ";
        if (save) {
            this.parking.save();
        }
        this.$("#garage").appendChild(row);
    };
    ParkingFront.prototype.close = function (cells) {
        if (cells[2] instanceof HTMLElement) {
            var vehicle = {
                name: cells[0].textContent || "",
                plate: cells[1].textContent || "",
                time: new Date().valueOf() -
                    new Date(cells[2].dataset.time).valueOf()
            };
            this.parking.close(vehicle);
        }
    };
    ParkingFront.prototype.render = function () {
        var _this = this;
        this.$("#garage").innerHTML = "";
        this.parking.courtyard.forEach(function (c) { return _this.add(c); });
    };
    return ParkingFront;
}());
var Parking = /** @class */ (function () {
    function Parking() {
        this.courtyard = localStorage.courtyard ? JSON.parse(localStorage.courtyard) : [];
    }
    Parking.prototype.add = function (car) {
        this.courtyard.push(car);
    };
    Parking.prototype.close = function (info) {
        var time = this.calctime(info.time);
        var msg = "\n      The vehicle " + info.name + " de plate " + info.plate + " remained " + time + " parked.\n      \n\n Do you want to close?\n    ";
        if (!confirm(msg))
            return;
        this.courtyard = this.courtyard.filter(function (car) { return car.plate !== info.plate; });
        this.save();
    };
    Parking.prototype.calctime = function (thousand) {
        var min = Math.floor(thousand / 60000);
        var sec = Math.floor((thousand % 60000) / 1000);
        return min + "m e " + sec + "s";
    };
    Parking.prototype.save = function () {
        console.log("Saving...");
        localStorage.courtyard = JSON.stringify(this.courtyard);
    };
    return Parking;
}());
(function () {
    var $ = function (q) {
        var elem = document.querySelector(q);
        if (!elem)
            throw new Error("An error occurred while fetching the element.");
        return elem;
    };
    var parking = new ParkingFront($);
    parking.render();
    $("#send").addEventListener("click", function () {
        var name = $("#name").value;
        var plate = $("#licence").value;
        if (!name || !plate) {
            alert("Fields are mandatory.");
            return;
        }
        var car = { name: name, plate: plate, prohibited: new Date() };
        parking.add(car, true);
        $("#name").value = "";
        $("#licence").value = "";
    });
    $("#garage").addEventListener("click", function (_a) {
        var target = _a.target;
        if (target.className === "delete") {
            parking.close(target.parentElement.parentElement.cells);
            parking.render();
        }
    });
})();
