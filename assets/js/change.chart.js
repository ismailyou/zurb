const form = document.getElementById('changeCanvas');
let url = '';
let cases = true, deaths= true, recovered = true;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // define New Url
    url = `https://disease.sh/v3/covid-19/historical/${formData.get('country')}?lastdays=${parseInt(formData.get('days'))+ 1}`;
    cases = formData.get('cases') == null ? false : true;
    deaths = formData.get('deaths') == null ?  false : true;
    recovered = formData.get('recovered') == null ? false :  true;

    // Change The Chart
    get_data(url).then(function (data){
        let info = JSON.parse(data);

        if(formData.get("country") == "all"){
            chart_data = format_chart(info);
        }else{
            chart_data = format_chart(info.timeline);
        }

        draw_chart(chart_data, cases, deaths, recovered);

    }).catch(function (err) {
        console.log(err);
    });

});
