let buttons = (data, context) => {
    let bubbles = tree()

    // Initial tree
    let filterData = filterTree(data, context, "overall")
    bubbles.GUP(filterData)
    
    // Button 1
    d3.selectAll("button.overall")
        .on ("click", d => {
            let filterData = filterTree(data, context, "overall")
            bubbles.GUP(filterData, "Overall")
        })
    

      // Button 1
    d3.selectAll("button.impact")
      .on ("click", d => {
          let filterData = filterTree(data, context, "impact")
          bubbles.GUP(filterData, "Impact")
      })

       // Button 1
    d3.selectAll("button.outputs")
       .on ("click", d => {
           let filterData = filterTree(data, context, "outputs")
           bubbles.GUP(filterData, "Outputs")
       })

       // Button 1
    d3.selectAll("button.environment")
       .on ("click", d => {
           let filterData = filterTree(data, context, "environment")
           bubbles.GUP(filterData, "Environment")
       })
}

