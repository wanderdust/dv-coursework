d3.circleMapGen = (data, context) => {
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
        .entries(newData)

    // Add values and get an average
    let addValues = nest.map(d => {
        return {
            coords:[ d.values[0].lp.LONGITUDE,  d.values[0].lp.LATITUDE],
            name: d.key,
            sum: d.values.map(e => e["overall"]["4*"]).reduce((x,y) => x+y),
            length: d.values.length,
            value: d.values.map(e => e["overall"]["4*"]).reduce((x,y) => x+y) / d.values.length,
        }
    })

    return addValues
}