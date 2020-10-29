let initialiseApp = (error, ref14data, ref14context , learningProviders, jsonTopicData , ref14Results) => {
    
    let dataModel =  modelConstructor()
        .addBasicTopicArrayData(true);

    dataModel.loadData(ref14data, ref14context , learningProviders, jsonTopicData, ref14Results);	
    let data = dataModel.model()	

    let providers = filterLearningProviders(learningProviders)
    let groupedProviders = filterUOA(data.refEntries)
    dropDown(providers, ref14data, groupedProviders, data.refEntries, ref14context)
    
    // INIT BUBBLES WITH UOAS
    buttons(data.refEntries, ref14context)

    // INIT BUBBLE TOPICS
    let topics = filterTopics(data)

    let topicBubbles = topicSimilarity(topics)
    topicBubbles.GUP(topics)

    // INIT THE CORR MATRIX
    let matrix = filterMatrix(data)

    correlation(matrix)

}


d3.queue()
    .defer(d3.csv, "data/topics/REF2014T30TopicOrder.csv")
    .defer(d3.csv, "data/290183_REF_Contextual_table_1314_0.csv")
    .defer(d3.csv, "data/learning-providers-plus.csv")
    .defer(d3.json, "data/topics/REF2014T30Python.json")
	.defer(d3.csv, "data/REF2014_Results.csv")
    .await(initialiseApp)
