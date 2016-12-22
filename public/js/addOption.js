/**
 * Created by Iaroslav Zhbankov on 22.12.2016.
 */
var addButton = document.querySelector(".addoption");
var deleteButton = document.querySelector(".deleteoption");
addButton.addEventListener("click", function () {
    var form = document.querySelector("form");
    var numberOptions = document.querySelectorAll("input").length;
    var new_field = document.createElement("div");
    var new_label = document.createElement("label");
    var new_input = document.createElement("input");
    new_label.innerText = "Option_" + numberOptions;
    new_field.setAttribute("class", "form-group");
    new_input.setAttribute("type", "text");
    new_input.setAttribute("name", "option_" + numberOptions);
    new_input.setAttribute("id", "user");
    new_input.setAttribute("class", "form-control");
    new_field.appendChild(new_label);
    new_field.appendChild(new_input);
    form.insertBefore(new_field, form.querySelector("button"));
});
deleteButton.addEventListener("click", function () {
    var option = document.querySelectorAll(".form-group");

    option[option.length - 1].remove();
});
