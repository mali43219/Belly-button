function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    var metadata = data.metadata;
    
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = resultsArray[0] 

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaSample = metadataArray[0]

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds =  resultsArray[0].otu_ids;
    var otuLabels = resultsArray[0].otu_labels;
    var sampleValues = resultsArray[0].sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washFreq = metadataArray[0].wfreq;
    var washFreqFloat = parseFloat(washFreq).toFixed(2);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    yticks = otuIds.map(otuID => `OTU ${otuID}`).slice(0, 10).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: resultsArray[0].otu_labels,
        type: "bar",
        orientation: "h" 
      }
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found",
      font: {
        family: 'Lato',
        size: 16, 
        color: 'rgb(100,150,200)'
      },
      plot_bgcolor: 'rgba(200,255,0,0.1)',
      margin: {
        pad: 10
      },
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)
   
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: otuIds,
          size: sampleValues,
          colorscale: "Greens",
        },
     }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleDatalayout = {
      hovermode: 'closest',
      title: 'Belly Button Bacteria',
      xaxis: {title: "OTU ID"},
      margin: { t: 50 }
      
    };

  // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleDatalayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washFreqFloat,
      title: {
        text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>",
        font: {size: 24} },
      gauge: {
        axis: {
          range: [0, 10]
        },
        bar: {color: "black"},
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color: "purple"},
          {range: [2,4], color: "blue"},
          {range: [4,6], color: "pink"},
          {range: [6,8], color: "red"},
          {range: [8,10], color: "green"}
        ]
      }
    }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: {t: 20, b: 20, l: 20, r: 20, },
      width: 500,
      height: 425
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}