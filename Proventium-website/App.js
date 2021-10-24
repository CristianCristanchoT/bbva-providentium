var paisactual = null;
var graficaCC;
var nubeCC;

var graficaEO;
var nubeEO;

var graficaFS;
var nubeFS;

var tipoCC = "positivo";
var tipoEO = "positivo";
var tipoFS = "positivo";

var peticion ;
var question;
var answer;

async function get_response(input, url) {
    try {
    
        const response = await fetch(url, 
        {
            method: 'POST',
            body: JSON.stringify(input), // data can be string or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(result);        
        document.getElementById("answer").value = result;
        return result;
    } catch (error) {
        console.error(error);
    }
}

window.onload = function (params) {
    var modal_container = document.getElementById('modal_container');
    var btnclose = document.getElementById('close');
    var ciudadModal = document.getElementById('ciudadModal');

    graficaCC = document.getElementById('data-crecer-cliente');
    nubeCC = document.getElementById('word-crecer-cliente');

    graficaEO = document.getElementById('data-excelencia-operativa');
    nubeEO = document.getElementById('word-excelencia-operativa');

    graficaFS = document.getElementById('data-futuro-sostenible');
    nubeFS = document.getElementById('word-futuro-sostenible');

    peticion = document.getElementById('peticion');
    question = document.getElementById('question');
    answer = document.getElementById('answer');

    var graficapais = document.getElementById('word-general');

    //Imagenes de Estrategias

    var pais = null;

    anychart.onDocumentReady(function () {
    // load the data
        anychart.data.loadJsonFile("Geo_Data.json", function (data) {
            // Variables
            // go into the records section of the data
            var geoData = data.records
            // sum of all cases per country
            var sumSentimiento = 0;
            // convert cases and deaths to numbers
            var numC;
            var numD;
            // create a new array with the resulting data
            var data = [];
            var listaPaises = [];

            // Go through the initial data
            for (var i = 0; i < geoData.length; i++) {
                // convert strings to numbers and save them to new variables
                numC = parseFloat(geoData[i].Sentimiento);

                // check if we are in the same country by comparing the geoId. 
                // if the country is the same add the cases and deaths to the appropriate variables
                if ((geoData[i + 1]) != null && (geoData[i].geoId == geoData[i + 1].geoId)) {
                    sumSentimiento = sumSentimiento + numC;
                }
                else {
                    // add last day cases and deaths of the same country
                    sumSentimiento = sumSentimiento + numC;

                    // insert the resulting data in the array using the AnyChart keywords 
                    data.push({ id: geoData[i].geoId, value: sumSentimiento, title: geoData[i].countriesAndTerritories })

                    // reset the variables to start over
                    sumSentimiento = 0;
                }
            };

            // connect the data with the map
            var chart = anychart.map(data);
            chart.geoData(anychart.maps.world);

            // specify the chart type and set the series 
            var series = chart.choropleth(data);

            // color scale ranges
            ocs = anychart.scales.ordinalColor([
                { less: 0.10 },
                { from: 0.11, to: 0.33 },
                { from: 0.34, to: 0.66 },
                { greater: 0.67 }
            ]);

            // set scale colors
            ocs.colors(["#fff", "#332c8c", "#86c53e", "#ffc70a"]);

            // tell the series what to use as a colorRange (colorScale)
            series.colorScale(ocs);

            // enable the legend
            chart.legend(true);

            // set the source mode of the legend and add styles
            chart.legend()
                .itemsSourceMode("categories")
                .position('right')
                .align('top')
                .itemsLayout('vertical')
                .padding(50, 0, 0, 20)
                .paginator(false);

            // tooltip formatting
            series.tooltip().format("Analisis de sentimiento: {%value}");

            // set the container id
            chart.container('container2');

            // add a listener
            chart.listen('dblclick', function (e) {
                var index = e.pointIndex;
                if(index){
                    direccionarPais(data[index]);
                }
            });

            // draw the chart
            chart.draw();
        });
    });

  
    btnclose.addEventListener('click', () => {
        modal_container.classList.remove('show');
    });

    var direccionarPais = function (datosPais) {
        var id = datosPais.id;  
        var textopais;

        switch (id) {
            case "CO":
                pais = 'Colombia';
                textopais = 'colombia';
                break;
            case "ES":

                pais = 'España';
                textopais = 'espana';
                break;
            case "MX":

                pais = 'Mexico';
                textopais = 'mexico';
                break;
            default:
                return;
        }

        paisactual = textopais;

        var graficaCCtxt = "./Graficaspopup/SCATTERS/crecerclientes/" + paisactual + "/crecerclientes_" + paisactual + "_positivos.html";
        var nubeCCtxt = "./Graficaspopup/Word_clouds/crecer_clientes/" + paisactual + "/positivo/@.png";
        graficaCC.src = graficaCCtxt;
        nubeCC.src = nubeCCtxt;

        var graficaEOtxt = "./Graficaspopup/SCATTERS/excelenciaoperativa/" + paisactual + "/exceloperativa_" + paisactual + "_positivos.html";
        var nubeEOtxt = "./Graficaspopup/Word_clouds/excel_operativa/" + paisactual + "/positivo/@.png";
        graficaEO.src = graficaEOtxt;
        nubeEO.src = nubeEOtxt;

        var graficaFStxt = "./Graficaspopup/SCATTERS/futurosostenible/futuro_sostenible_" + paisactual + ".html";
        var nubeFStxt = "./Graficaspopup/Word_clouds/futuro_sostenible/" + paisactual + "/@.png";
        graficaFS.src = graficaFStxt;
        nubeFS.src = nubeFStxt;

        graficapais.src = "./Graficas/" + paisactual + ".png";

        ciudadModal.innerHTML = pais;
        modal_container.classList.add('show');
    }

    let tabHeader = document.getElementsByClassName("tab-header")[0];
    let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
    let tabBody = document.getElementsByClassName("tab-body")[0];
    
    let tabsPane = tabHeader.getElementsByTagName("div");
    
    for(let i=0;i<tabsPane.length;i++){
        tabsPane[i].addEventListener("click",function(){
            tabHeader.getElementsByClassName("active")[0].classList.remove("active");
            tabsPane[i].classList.add("active");
            tabBody.getElementsByClassName("active")[0].classList.remove("active");
            tabBody.getElementsByClassName("informacion")[i].classList.add("active");
            
            tabIndicator.style.left = `calc(calc(100% / 4) * ${i})`;
        });
    }

    
    
}
  
var mostrarCCpos = function () {
    graficaCC.src = "./Graficaspopup/SCATTERS/crecerclientes/" + paisactual + "/crecerclientes_" + paisactual + "_positivos.html"
    tipoCC = 'positivo';
    seleccionarNubeCC();
}

var mostrarCCneg = function () {
    graficaCC.src = "./Graficaspopup/SCATTERS/crecerclientes/" + paisactual + "/crecerclientes_" + paisactual + "_negativos.html"
    tipoCC = 'negativo';
    seleccionarNubeCC();
}

var seleccionarNubeCC = function () {
    let valor = document.getElementById("cbxLenguajes").value;
    nubeCC.src = "./Graficaspopup/Word_clouds/crecer_clientes/" + paisactual + "/" + tipoCC + "/" + valor + ".png";
}

var mostrarEOpos = function () {
    graficaEO.src = "./Graficaspopup/SCATTERS/excelenciaoperativa/" + paisactual + "/exceloperativa_" + paisactual + "_positivos.html"
    tipoEO = 'positivo';
    seleccionarNubeEO();
}

var mostrarEOneg = function () {
    graficaEO.src = "./Graficaspopup/SCATTERS/excelenciaoperativa/" + paisactual + "/exceloperativa_" + paisactual + "_negativos.html"
    tipoEO = 'negativo';
    seleccionarNubeEO();
}

var seleccionarNubeEO = function () {
    let valor = document.getElementById("cbxLenguajesEO").value;
    nubeEO.src = "./Graficaspopup/Word_clouds/excel_operativa/" + paisactual + "/" + tipoEO + "/" + valor + ".png";
}

var nubeFStxt = "./Graficaspopup/Word_clouds/futuro_sostenible/" + paisactual + "/@.png";

var seleccionarNubeFS = function () {
    let valor = document.getElementById("cbxLenguajesFS").value;
    nubeFS.src = "./Graficaspopup/Word_clouds/futuro_sostenible/" + paisactual + "/" + valor + ".png";
}


async function consulta()
{
/*
    var input = {
        "pregunta": question.value 
        };


    var paisservicio = paisactual != null && paisactual != '' && paisactual != undefined ? paisactual : 'colombia';
    var url = "https://question-answer-image-3vya5dggcq-uc.a.run.app/pregunta_"+ paisservicio;

    respuesta = get_response(input, url)

*/    


    url = "https://question-answer-image-3vya5dggcq-uc.a.run.app/pregunta_" + paisactual;

    pregunta = document.getElementById("question").value;


    var input = {
        "pregunta": pregunta 
        };

    respuesta = get_response(input, url)
    
    console.log(respuesta);


}


async function main()
{

    peticion.addEventListener('peticion', consulta());

}


main();