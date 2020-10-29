// Return Learning Providers and their UKPRN ID
let filterLearningProviders = (data) => {
    return data.map((d) => {
        if (d.LONGITUDE.length === 0 ) {
            d.LONGITUDE = "-5.926437";
            d.LATITUDE = "54.607868";
        }

        return {
            providerName: d.PROVIDER_NAME,
            ukprn: d.UKPRN,
            coordinates: [d.LONGITUDE, d.LATITUDE]
        }
    })
}


// Returns nested data for a provider
let filterUOA = (data, rating = "environmental") => {

    return d3.nest()
        .key(refEntry => refEntry["Institution code (UKPRN)"])
        .entries(data)

}

// Returns hierarchical data for bubbles
let filterTree = (data, context, type="environmentalenvironmental") => {
    let newData = data.map(d => {
        let region = context.filter(e => {
            return e.UKPRN == d["Institution code (UKPRN)"] 
        })
        try {
            d.region = region[0]["Region of provider"]
        } catch {
            d.region = "LOND"
        }
        return d 
    })

    let nest =  d3.nest()
        .key(refEntry => refEntry.region)
            .sortKeys((a,b) => d3.ascending(a.UoAValue, b.UoAValue))
        .key(refEntry => refEntry["UoAString with Multiple submission letter appended"])
            .sortKeys((a,b) => d3.ascending(a.UoAValue, b.UoAValue))
        .entries(newData)
    
    // Add values and get an average
    let addValues = nest.map(d => {
        return {
            name: d.key,
            children: d.values.map(dd => {
                return {
                    name: dd.key,
                    uoa: dd.key.split(" ").join("").split(",").join("-").toLowerCase(),
                    docID: dd.values[0].DocumentID,
                    value: dd.values.map(e => e[type]["4*"]).reduce((x,y) => x+y) / dd.values.length
                }
            })
        }
    })

    let hValues = {
        name: "Units of Assessment in the UK", 
        children: addValues
    }
    return hValues
}

const lowerCase = text => {
    lower = text.toLowerCase()
    return lower.split(" ").map(d => {
        firstUpper = d[0].toUpperCase()
        return [firstUpper, ...d.split("").slice(1)].join("")
    }).join(" ")
}


// Returns hierarchical data for bubbles
let filterTreeManager = (data, context, type="environmental") => {
    let newData = data.map(d => {
        let region = context.filter(e => {
            return e.UKPRN == d["Institution code (UKPRN)"] 
        })
        try {
            d.region = region[0]["Region of provider"]
        } catch {
            d.region = "LOND"
        }
        return d 
    })

    let nest =  d3.nest()
        .key(refEntry => refEntry.region)
            .sortKeys((a,b) => d3.ascending(a.UoAValue, b.UoAValue))
        .key(refEntry => refEntry["Institution code (UKPRN)"])
        .entries(newData)
    
    // Add values and get an average
    let addValues = nest.map(d => {
        return {
            name: d.key,
            ukprn: d.values[0]["Institution code (UKPRN)"],
            value: d.values.length
        }
    })

    let hValues = {
        name: "", 
        children: addValues
    }
    return hValues
}

let filterUnis = (data, context) => {
    let newData = data.map(d => {
        let region = context.filter(e => {
            return e.UKPRN == d["Institution code (UKPRN)"] 
        })
        try {
            d.region = region[0]["Region of provider"]
        } catch {
            d.region = "LOND"
        }
        return d 
    })
    let nest = d3.nest()
        .key(refEntry => refEntry["Institution name"])
            .sortKeys((a,b) => d3.ascending(a.UoAValue, b.UoAValue))
        .entries(newData)

    // Add values and get an average
    let addValues = nest.map(d => {
        return {
            name: d.key,
            region: d.values[0].region,
            value: d.values.map(e => e["environmental"]["4*"]).reduce((x,y) => x+y) / d.values.length,
            uoas: {
                4: d.values.map(e => e["environmental"]["4*"]).reduce((x,y) => x+y) / d.values.length,
                3: d.values.map(e => e["environmental"]["3*"]).reduce((x,y) => x+y) / d.values.length,
                2: d.values.map(e => e["environmental"]["2*"]).reduce((x,y) => x+y) / d.values.length,
                1: d.values.map(e => e["environmental"]["1*"]).reduce((x,y) => x+y) / d.values.length,
                unclassified: d.values.map(e => e["environmental"]["unclassified"]).reduce((x,y) => x+y) / d.values.length
            }
        }
    })
    return addValues
}

let filterTopics = ({topics}, context) => {

    let newTopics = topics.map(d => {
        return {
            name: d.words.first3words,
            number: d.topicNumber,
            similarTopics: d.similarities.map((dd, i) => {
                return {
                    name: topics[i].words.first3words,
                    similarity: dd
                }
            })
            .filter(d => d.similarity != 1)
            .filter(d => d.similarity > 0.02)
        }
    }).map(d => {
        return {
            ...d,
            similarTopics: d.similarTopics.sort((a,b) => b.similarity - a.similarity)
        }
    })


    let nest = d3.nest()
        .key(topic => topic.similarTopics[0].name)
        .key(topic => topic.similarTopics[1].name)
        .key(topic => topic.similarTopics[2].name)
        .entries(newTopics)

    // Add values and get an average
    let addValues = nest.map(d => {
        return {
            name: d.key,
            children: d.values.map(dd => {
                return {
                    name: dd.key,
                    value: dd.values.length
                }
            })
        }
    })

    let hValues = {
        name: "",
        children: addValues
    }
    return hValues
}

const filterMatrix = ({topics}) => {
    let correlations = []

    const newTopics = topics.map(d => {
        return {
            name: d.words.first3words,
            similarities: d.similarities.map((dd, i) => {
                return {
                    name: topics[i].words.first3words,
                    weight: dd
                }
            })
        }
    })

    for (i in newTopics) {
        for (j in newTopics[i].similarities){
            let topic = {
                group: newTopics[i].name,
                variable: "",
                value: ""
            }
            topic.variable = newTopics[i].similarities[j].name
            topic.value = newTopics[i].similarities[j].weight

            correlations.push(topic)
        }
    }

    return correlations

}