/**
 * Created by Iaroslav Zhbankov on 23.12.2016.
 */
var ctx = document.getElementById("myChart").getContext("2d");

var data = {
    labels: optionsName,
    datasets: [
        {
            data: optionsSize,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FFCE56",
                "F4FF79",
                "6DB3FF",
                "00C900",
                "1E2C3D"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FFCE56",
                "F4FF79",
                "6DB3FF",
                "00C900",
                "1E2C3D"
            ]
        }]
};
var options = {
    cutoutPercentage: 0,
    rotation: -0.5 * Math.PI,
    circumference: 2 * Math.PI,
    animation: {
        animateRotate: true,
        animateScale: false
    }

};
Chart.defaults.global.maintainAspectRatio = false;
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
});
