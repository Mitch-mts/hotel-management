/*
function createPluginTable(id, options, results) {
    const table = document.createElement("table");
    table.id = id;
    table.style.cssText = "width: 100%; white-space: nowrap;";
    table.className = "cam-table";

    const thead = document.createElement("thead");

    thead.appendChild(createTrTdWithSpan(options));
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    results.forEach(result => {
        tbody.appendChild(createTrTdWithSpan(result));
    });

    table.appendChild(tbody)

    return table;
}

function createTdWithSpan(option) {
    const td = document.createElement("td");
    td.className = "type-string col-name";

    const span = document.createElement("span");
    span.style.cssText = option.spanCss;

    if (option.a) {
        const link = document.createElement("a");

        if (option.a.href) {
            link.href = option.a.href;
        }

        if (option.a.fn) {
            link.onclick = option.a.fn
        }

        link.innerText = option.text;
        link.style.cssText = "cursor: pointer;";

        span.appendChild(link);
    } else {
        span.innerHTML = option.text;
    }

    td.appendChild(span);

    return td;
}

function createTrTdWithSpan(options) {
    const tr = document.createElement("tr");

    options.forEach(option => {
        tr.appendChild(createTdWithSpan(option));
    });

    return tr;
}

function createSidebarContent(options) {
    const sidebarContent = document.createElement("div");
    sidebarContent.className = "tab-content";

    options.forEach(option => {
        const sidebarContentPInfoDl = document.createElement("dl");
        sidebarContentPInfoDl.className = "process-information";
        sidebarContentPInfoDl.style.cssText = "margin-bottom: 0px; padding-bottom: 0px; padding-top: 0px;";

        const sidebarContentPInfoDlDt = document.createElement("dt");

        // <a  uib-tooltip="Click to copy 'COPStartJuristicProcess:17:84a942a3-784e-11ec-8071-94e23c01da20'"
        //    tooltip-append-to-body="true"
        //    className="glyphicon glyphicon-copy"></a>

        const copyTo = document.createElement("a");
        copyTo.className = "glyphicon glyphicon-copy";
        copyTo.style.opacity = "0";
        copyTo.onclick = function () {
            navigator.clipboard.writeText(option.val).then();
        }

        sidebarContentPInfoDl.onmouseover = function () {
            copyTo.style.opacity = "100";
        }

        sidebarContentPInfoDl.onmouseleave = function () {
            copyTo.style.opacity = "0";
        }

        const sidebarContentPInfoDlDtSpan = document.createElement("span");

        const sidebarContentPInfoDlDtSpanSpan = document.createElement("span")
        sidebarContentPInfoDlDtSpanSpan.innerHTML = option.text;

        const sidebarContentPInfoDlDd = document.createElement("dd");
        sidebarContentPInfoDlDd.innerHTML = option.val;

        sidebarContentPInfoDlDtSpan.appendChild(sidebarContentPInfoDlDtSpanSpan);
        sidebarContentPInfoDlDtSpan.appendChild(copyTo);
        sidebarContentPInfoDlDt.appendChild(sidebarContentPInfoDlDtSpan);
        sidebarContentPInfoDl.appendChild(sidebarContentPInfoDlDt);
        sidebarContentPInfoDl.appendChild(sidebarContentPInfoDlDd);

        sidebarContent.appendChild(sidebarContentPInfoDl);
    });

    return sidebarContent;
}

export default [
    {
        id: "history-list-instance-view",
        pluginPoint: "cockpit.route",
        properties: {
            path: '/history/process-definition-id/:processdefinitionid/process-instance/:processinstanceid',
            label: '/history',
        },
        render: (container, {api}) => {
            const mainContent = document.createElement("div");
            mainContent.innerHTML = "Loading...";

            container.appendChild(mainContent);

            // <div id="variable.modal" class="modal">

            const modal = document.createElement("div");
            modal.id = "variable.modal";
            modal.style.cssText = "display: none;  position: fixed;  z-index: 15; left: 0;  top: 0;  width: 100%;   height: 100%; overflow: auto; background-color: rgb(0,0,0);  background-color: rgba(0,0,0,0.4);"

            mainContent.appendChild(modal);

            //     <!-- Modal content -->
            //     <div class="modal-content">

            const modalContent = document.createElement("div");
            modalContent.class = "modal-content";
            modalContent.style.cssText = "background-color: #fefefe;  margin: 15% auto; padding: 20px;  border: 1px solid #888; width: 80%;";

            modal.appendChild(modalContent);

            //         <span class="close">&times;</span>

            const modalContentSpanClose = document.createElement("span");
            modalContentSpanClose.class = "close";
            modalContentSpanClose.style.cssText = "float: right;"
            modalContentSpanClose.innerHTML = "&times;";

            // When the user clicks on <span> (x), close the modal
            modalContentSpanClose.onclick = function () {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }

            modalContent.appendChild(modalContentSpanClose);

            //         <p>Some text in the Modal..</p>

            const modalContentParagraph = document.createElement("p");
            modalContentParagraph.innerHTML = "";
            modalContentParagraph.style.cssText = "white-space: pre-wrap;";

            modalContent.appendChild(modalContentParagraph);

            const hash = window?.location?.hash ?? '';
            const processDefinitionIdMatch = hash.match(/\/history\/process-definition-id\/([^\/]*)/);
            const processDefinitionId = processDefinitionIdMatch ? processDefinitionIdMatch[1].split('?')[0] : null;
            const processInstanceIdMatch = hash.match(/\/process-instance\/([^\/]*)/);
            const processInstanceId = processInstanceIdMatch ? processInstanceIdMatch[1].split('?')[0] : null;

            // <div class="ctn-content-container">

            const ctnContentContainer = document.createElement("div");
            ctnContentContainer.className = "ctn-content-container";

            // START SIDEBAR
            // <div className="ctn-column ctn-sidebar ctn-scroll" style="width: 280px;"></div>

            const sidebar = document.createElement("div");
            sidebar.className = "ctn-column ctn-sidebar ctn-scroll";
            sidebar.style.cssText = "width: 280px;";

            // <ul className="nav nav-tabs">

            const sidebarNavTabs = document.createElement("ul");
            sidebarNavTabs.className = "nav nav-tabs";

            // <li ng-class="{active: sidebarTab === 'info'}" className="active">

            const sidebarNavTabsLi = document.createElement("li");
            sidebarNavTabsLi.className = "active";

            // <a>Information</a>

            const sidebarNavTabsLiA = document.createElement("a");
            sidebarNavTabsLiA.innerHTML = "Information";

            sidebarNavTabsLi.appendChild(sidebarNavTabsLiA);
            sidebarNavTabs.appendChild(sidebarNavTabsLi);

            fetch(api.engineApi + "/history/process-instance?processInstanceId=" + processInstanceId).then(async res => {
                const results = await res.json();

                if (!results.length) {
                    return;
                }

                const options = [{text: "Instance ID:", val: results[0].id},
                    {text: "Business Key:", val: results[0].businessKey},
                    {text: "Definition Version:", val: results[0].processDefinitionVersion},
                    {text: "Definition ID:", val: results[0].processDefinitionId},
                    {text: "Definition Key:", val: results[0].processDefinitionKey},
                    {text: "Definition Name:", val: results[0].processDefinitionName}];

                sidebar.appendChild(createSidebarContent(options));
            });

            sidebar.appendChild(sidebarNavTabs);

            // END SIDEBAR

            // START CONTAINER

            // <div className="ctn-column ctn-content" style="left: 280px;">

            const content = document.createElement("div");
            content.className = "ctn-column ctn-content";
            content.style.cssText = "left: 280px;";

            // <div className="ctn-row ctn-content-top" style="height: 306.306px;"></div>

            const top = document.createElement("div");
            top.className = "ctn-row ctn-content-top";
            top.style.cssText = "height: 306.306px;";

            // <div className="ctn-row ctn-content-bottom ctn-tabbed" style="top: 306.306px;"></div>

            const bottom = document.createElement("div");
            bottom.className = "ctn-row ctn-content-bottom ctn-tabbed";
            bottom.style.cssText = "top: 306.306px;";

            content.appendChild(top);
            content.appendChild(bottom);

            ctnContentContainer.appendChild(sidebar);
            ctnContentContainer.appendChild(content);

            container.appendChild(ctnContentContainer);

            // END CONTAINER

            const bottomTabs = document.createElement("div");

            bottom.appendChild(bottomTabs);

            // <ul>

            const bottomTabsNavTabs = document.createElement("ul");
            bottomTabsNavTabs.className = "nav nav-tabs";

            bottomTabs.appendChild(bottomTabsNavTabs);

            // <li className="active">

            const bottomTabsNavTabsVariablesLi = document.createElement("li");
            bottomTabsNavTabsVariablesLi.className = "active";

            bottomTabsNavTabs.appendChild(bottomTabsNavTabsVariablesLi);

            // <a href="" >Variables</a>

            const bottomTabsNavTabsVariablesLiA = document.createElement("a");
            bottomTabsNavTabsVariablesLiA.innerHTML = "Variables";

            bottomTabsNavTabsVariablesLiA.onclick = function () {
                const auditLogTable = document.getElementById("audit-log.table");
                const variablesTable = document.getElementById("variables.table");
                variablesTable.style.display = "inherit";
                auditLogTable.style.display = "none";
                bottomTabsNavTabsVariablesLi.className = "active";
                bottomTabsNavTabsAuditLi.className = "";
            }

            bottomTabsNavTabsVariablesLi.appendChild(bottomTabsNavTabsVariablesLiA);

            // <div className="ctn-tabbed-content ctn-scroll">

            const bottomTabsContent = document.createElement("div");
            bottomTabsContent.className = "ctn-tabbed-content ctn-scroll";

            bottomTabs.appendChild(bottomTabsContent);

            fetch(api.engineApi + "/history/variable-instance?processInstanceId=" + processInstanceId).then(async res => {
                const results = await res.json();

                if (!results.length) {
                    const noResults = document.createElement("div");
                    noResults.innerHTML = "No variable-instance";
                    bottomTabsContent.appendChild(noResults);
                    bottomTabsContent.appendChild(createPluginTable("variables.table", [], []));
                    return;
                }

                results.sort(function (a, b) {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                });

                const theadStyle = "font-weight: bolder;";

                const options = [{text: "Name", spanCss: theadStyle},
                    {text: "Type", spanCss: theadStyle},
                    {text: "Value", spanCss: theadStyle}];

                let resultsWrapper = [];

                results.forEach(result => {
                    if (result.type === "Object") {
                        const resultValueInfo = function () {
                            modal.style.display = "block";
                            modalContentParagraph.innerHTML = JSON.stringify(result.value, undefined, 2);
                        }

                        resultsWrapper.push([{text: result.name},
                            {text: result.type},
                            {text: result.valueInfo.objectTypeName, a: {fn: resultValueInfo}}])

                    } else {
                        resultsWrapper.push([{text: result.name},
                            {text: result.type},
                            {text: result.value}])
                    }

                });

                bottomTabsContent.appendChild(createPluginTable("variables.table", options, resultsWrapper));
            });

            // AUDIT LOG START

            const bottomTabsNavTabsAuditLi = document.createElement("li");

            bottomTabsNavTabs.appendChild(bottomTabsNavTabsAuditLi);

            // <a href="" >Audit Log</a>

            const bottomTabsNavTabsAuditLiA = document.createElement("a");
            bottomTabsNavTabsAuditLiA.innerHTML = "Audit Log";

            bottomTabsNavTabsAuditLiA.onclick = function () {
                const auditLogTable = document.getElementById("audit-log.table");
                const variablesTable = document.getElementById("variables.table");
                auditLogTable.style.display = "inherit";
                variablesTable.style.cssText = "display: none;";
                bottomTabsNavTabsVariablesLi.className = "";
                bottomTabsNavTabsAuditLi.className = "active";
            }

            bottomTabsNavTabsAuditLi.appendChild(bottomTabsNavTabsAuditLiA);

            fetch(api.engineApi + "/history/activity-instance?processInstanceId=" + processInstanceId).then(async res => {
                const results = await res.json();

                if (!results.length) {
                    const noResults = document.createElement("div");
                    noResults.innerHTML = "No activity-instance";
                    bottomTabsContent.appendChild(noResults);
                    return;
                }

                results.sort(function (a, b) {
                    a = a.endTime ? new Date(a.endTime) : new Date();
                    b = b.endTime ? new Date(b.endTime) : new Date();

                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                });

                const theadStyle = "font-weight: bolder;";

                const options = [{text: "Activity Name", spanCss: theadStyle},
                    {text: "Activity Id", spanCss: theadStyle},
                    {text: "Start Time", spanCss: theadStyle},
                    {text: "End Time", spanCss: theadStyle},
                    {text: "Duration", spanCss: theadStyle},
                    {text: "Type", spanCss: theadStyle},
                    {text: "Canceled", spanCss: theadStyle}];

                let resultsWrapper = [];

                results.forEach(result => {
                    resultsWrapper.push([{text: result.activityName},
                        {text: result.activityId},
                        {text: result.startTime},
                        {text: result.endTime},
                        {text: getDuration(result.endTime ? new Date(result.endTime).getTime() - new Date(result.startTime).getTime() : '')},
                        {text: result.activityType},
                        {text: result.canceled}])
                });

                const auditLogTable = createPluginTable("audit-log.table", options, resultsWrapper);
                auditLogTable.style.display = "none";

                bottomTabsContent.appendChild(auditLogTable);
            });

            // AUDIT LOG END

            fetch(api.engineApi + "/process-definition/" + processDefinitionId + "/xml").then(async res => {
                const result = await res.json();

                if (!result) {
                    return;
                }

                const bpmnViewer = new BpmnJS();

                await bpmnViewer.importXML(result.bpmn20Xml).then(function () {
                    fetch(api.engineApi + "/history/activity-instance?processInstanceId=" + processInstanceId).then(async res => {
                        const result = await res.json();

                        if (!result.length) {
                            return;
                        }

                        const overlays = bpmnViewer.get('overlays');
                        const elementRegistry = bpmnViewer.get('elementRegistry');

                        result.forEach(element => {
                            if (element.activityType !== "multiInstanceBody") {
                                const shape = elementRegistry.get(element.activityId);
                                const sp = -10;
                                const offset = (sp * 2 * -1);
                                const height = shape ? shape.height + offset : 0;
                                const width = shape ? shape.width + offset : 0;
                                const overlayHtml = `<div><div style="border-radius: 10px; background-color: green; opacity: 0.4; width: ${width}px; height: ${height}px;"></div><span>${element.activityId}</span></div>`

                                overlays.add(element.activityId, 'note', {
                                    position: {
                                        top: sp,
                                        left: sp
                                    },
                                    html: overlayHtml
                                });
                            }
                        });

                    });

                }).catch(function (err) {
                    console.error('could not import BPMN 2.0 diagram', err);
                });

                top.appendChild(bpmnViewer._container);
                bpmnViewer.get('canvas').zoom('fit-viewport');
            });

            function getDuration(duration) {
                const milliseconds = parseInt(`${(duration % 1000) / 100}`, 10),
                    seconds = Math.floor((duration / 1000) % 60),
                    minutes = Math.floor((duration / (1000 * 60)) % 60),
                    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                const hours_ = hours < 10 ? '0' + hours : hours;
                const minutes_ = minutes < 10 ? '0' + minutes : minutes;
                const seconds_ = seconds < 10 ? '0' + seconds : seconds;

                return hours_ + ':' + minutes_ + ':' + seconds_ + '.' + milliseconds;
            }

        }

    }
];
*/
