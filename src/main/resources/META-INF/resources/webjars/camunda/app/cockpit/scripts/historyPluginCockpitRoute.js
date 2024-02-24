function createPluginTable(id, options, results) {
    const table = document.createElement("table");
    table.id = id;
    table.style.cssText = "width: 100%; white-space: nowrap;";
    table.className = "cam-table"

    const thread = document.createElement("thread");
    thread.appendChild(createTrTdWitSpan(options));
    table.appendChild(thread);

    const tbody = document.createElement("tbody");

    results.forEach(result => {
        tbody.appendChild(createTrTdWitSpan(result))
    });

    table.appendChild(tbody)
    return table
}

function createTdWitSpan(option) {
    const td = document.createElement("td")
    td.className
}