// function that populates the meta data
function demoInfo(sample)
{
    console.log(sample);

    d3.json("samples.json").then((data) => {
        //grab metadata
        let metaData = data.metadata;
        
        // filter based on value od sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        
        // access index 0 from teh array
        let resultData = result[0];
        
        //clear the metadata 
        d3.select("#sample-metadata").html(""); 

        // use object.entries to get teh value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            
            // add to the sample data / demo section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });

}

// function that builds the bar graph
function buildBarChart(sample)
{
    console.log(sample);
    
    d3.json("samples.json").then((data) => {
        //grab sampleData
        let sampleData = data.samples;
                
        // filter based on value od sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
          
        // access index 0 from teh array
        let resultData = result[0];
         console.log(resultData);

        //get the otu _ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        
        // build the bar chart
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textlabels = otu_labels.slice(0, 10);
        
        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textlabels.reverse(),
            type: "bar",
            orientation: "h"
        }
    
        let layout = {
        title: "Top 10 Belly Button Bacteria"
         };

        Plotly.newPlot("bar", [barChart], layout);
    });
}

//function that builds teh bubble chart
function buildBubbleChart(sample)
{
        d3.json("samples.json").then((data) => {
        //grab sampleData
        let sampleData = data.samples;
        console.log(sampleData);
                        
        // filter based on value od sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
                
        // access index 0 from teh array
        let resultData = result[0];
             
        //get the otu _ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        
        // build teh bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
       
        let layout = {
            title: "Bacteria Cultures per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        
        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}

// function that initializes the dashboard
function initialize()
{
    //access the dropdown selector from index.html
    var select = d3.select("#selDataset");

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;  // made array of just names
        
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        let sample1 = sampleNames[0];

        // call function to build metadeta
        demoInfo(sample1);
        // call function to build bar chart
        buildBarChart(sample1);
        //call function to build the bubble chart
        buildBubbleChart(sample1);
    });
}

// functon that initiates teh dashboard
function optionChanged(item)
{
    // call the update to the metadata
    demoInfo(item);
    // call function to build bar chart
    buildBarChart(item);
    //call function to build teh bubble chart
    buildBubbleChart(item);
}

// call the initilize function
initialize();