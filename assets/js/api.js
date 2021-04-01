function get_data(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
function yes_date(){
    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.toDateString();

    let ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(yesterday);
    let mo = new Intl.DateTimeFormat('fr', { month: 'long' }).format(yesterday);
    let da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(yesterday);

    return `${da} ${mo} ${ye}`;
}

let largeTable = $('#table_large').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
    }
});
let SmallTable = $('#table_small').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
    }
});

$(".date").html(yes_date());

// GET DASHBOARD STATISTICS
get_data('https://disease.sh/v3/covid-19/all?yesterday=false&twoDaysAgo=false&allowNull=false'
).then(function (data) {
    let info = JSON.parse(data);
    $("#Tcases").attr("data-purecounter-end", info.todayCases);
    $("#Tdeath").attr("data-purecounter-end", info.todayDeaths);
    $("#Trecoverd").attr("data-purecounter-end", info.todayRecovered);
}).catch(function (err) {
    console.log(err);
});

// Draw the first Shart
get_data('https://disease.sh/v3/covid-19/historical/all?lastdays=10').then(function (data){
    let info = JSON.parse(data);
    chart_data = format_chart(info);
    draw_chart(chart_data);

}).catch(function (err) {
    console.log(err);
});
let total = {
    cases : 0,
    deaths : 0,
    recovered : 0
};
// FILL DATATABLE
get_data('https://corona.lmao.ninja/v2/countries').then(function (data) {

    let arrowup = "<span class='up'><i class='fi-arrow-up'></i></span>";
    let arrowdown = "<span class='down'><i class='fi-arrow-down'></i></span>";
    let heart = "<span class='heart'><i class='fi-heart'></i></span>";
    let warning = "<span class='warning'><i class='fi-alert'></i></span>";

    let todayCasesCss = '', todayRecoveredCss = '', todayDeathsCss = '' , CriticalCasesCss ='';
    for (let r of JSON.parse(data)) {
        total.cases += r.cases;
        total.deaths += r.deaths;
        total.recovered += r.recovered;

        todayCasesCss = (r.todayCases > 0) ? arrowup : '';
        todayRecoveredCss = (r.todayRecovered > 0) ? heart : '';
        todayDeathsCss = (r.todayDeaths > 0) ? arrowdown : '';
        CriticalCasesCss = (r.critical > 0) ? warning : '';

        // Country array for select box
        $('#country').append(new Option(r.country, r.country));
        largeTable.row.add([
            r.country.slice(0, 10),
            nFormatter(r.population, 2),
            nFormatter(r.cases, 2),
            todayCasesCss + nFormatter(r.todayCases, 2),
            nFormatter(r.deaths, 2),
            todayDeathsCss + nFormatter(r.todayDeaths, 2),
            nFormatter(r.recovered, 2),
            todayRecoveredCss + nFormatter(r.todayRecovered, 2),
            nFormatter(r.active, 2),
            CriticalCasesCss + nFormatter(r.critical, 2)
        ]).draw(false);
        $('#TotalCases').html(nFormatter(total.cases, 2));
        $('#TotalDeaths').html(nFormatter(total.deaths, 2));
        $('#TotalRecovered').html(nFormatter(total.recovered, 2));
        SmallTable.row.add([
            r.country.slice(0, 7),
            todayDeathsCss + nFormatter(r.todayDeaths, 2),
            todayRecoveredCss + nFormatter(r.todayRecovered, 2),
            CriticalCasesCss + nFormatter(r.critical, 2)
        ]).draw(false);
    }



}).catch(function (err) {
    console.log(err);
});