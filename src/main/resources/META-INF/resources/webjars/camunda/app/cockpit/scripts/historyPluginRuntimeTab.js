/*
const globalFirstResult = 0;
const globalMaxResults = 50;
let globalProcessDefinitionId = "";
const globalEndpoint = "/history/process-instance";
let globalAPI = "";
let currRequestBody = {};
let currFirstResult = globalFirstResult;
let currMaxResult = globalMaxResults;

const featureBlacklist = [
    "processDefinitionId", "processDefinitionKey", "processDefinitionKeyIn", "processDefinitionKeyNotIn",
    "processDefinitionName", "processDefinitionNameLike", "maxResults", "orQueries"
];
const featureList = [
    "firstResult", "maxResults", "processInstanceId", "processInstanceIds", "processInstanceBusinessKey",
    "processInstanceBusinessKeyIn", "processInstanceBusinessKeyLike", "rootProcessInstances", "superProcessInstanceId",
    "subProcessInstanceId", "superCaseInstanceId", "subCaseInstanceId", "caseInstanceId", "processDefinitionId",
    "processDefinitionKey", "processDefinitionKeyIn", "processDefinitionKeyNotIn", "processDefinitionName",
    "processDefinitionNameLike", "finished", "unfinished", "withIncidents", "withRootIncidents", "incidentType",
    "incidentStatus", "incidentMessage", "incidentMessageLike", "startedBy", "startedBefore", "startedAfter",
    "finishedBefore", "finishedAfter", "tenantIdIn", "withoutTenantId", "variables", "variableNamesIgnoreCase",
    "variableValuesIgnoreCase", "sorting", "executedActivityBefore", "executedActivityAfter", "executedActivityIdIn",
    "activeActivityIdIn", "executedJobBefore", "executedJobAfter", "active", "suspended", "completed",
    "externallyTerminated", "internallyTerminated", "orQueries"
];

//Refer to documentation - https://docs.camunda.org/manual/7.16/reference/rest/history/process-instance/post-process-instance-query/
const processInstanceId = "Filter by process instance id.";
const processInstanceBusinessKey = "Filter by process instance business key.";
const processInstanceBusinessKeyLike = "Filter by process instance business key that the parameter is a substring of.";
const incidentMessageLike = "Filter by the incident message that the parameter is a substring of.";
const withIncidents = "Only include process instances which have an incident.";
const variables = "Process instances that have/had variables with certain values.\n" +
    "Search criteria consists of three properties name, operator and value. name (String) is the variable name," +
    " operator (String) is the comparison operator to be used and value the variable value. \n" +
    "Valid operator values are: eq - equal to; neq - not equal to; gt - greater than; \n" +
    "gteq - greater than or equal to; lt - lower than; lteq - lower than or equal to; like.";
const finished = "Only include finished process instances.";
const unfinished = "Only include unfinished process instances.";
const active = "Restrict to instances that are active.";
const suspended = "Restrict to instances that are suspended.";
const completed = "Restrict to instances that are completed.";
const externallyTerminated = "Restrict to instances that are externally terminated.";
const internallyTerminated = "Restrict to instances that are internally terminated.";
const startedBefore = "Restrict to instances that were started before the given date.";
const startedAfter = "Restrict to instances that were started after the given date.";
const finishedBefore = "Restrict to instances that were finished before the given date.";
const finishedAfter = "Restrict to instances that were finished after the given date.";
const custom = "Use this as a direct hook into the API.\n" +
    "Provide a property and value, where a value can be a valid JSON object. \n" +
    "Refer to the Camunda documentation for a full list of properties. \n" +
    "Find it here - https://docs.camunda.org/manual/7.16/reference/rest/history/process-instance/post-process-instance-query/";

const fields = [
    {value: "", title: "", disabled: false},
    {value: "processInstanceId", title: processInstanceId, disabled: false},
    {value: "processInstanceBusinessKey", title: processInstanceBusinessKey, disabled: false},
    {value: "processInstanceBusinessKeyLike", title: processInstanceBusinessKeyLike, disabled: false},
    {value: "incidentMessageLike", title: incidentMessageLike, disabled: false},
    {value: "variables", title: variables, disabled: false},
    {value: "finished", title: finished, disabled: false},
    {value: "unfinished", title: unfinished, disabled: false},
    {value: "active", title: active, disabled: false},
    {value: "suspended", title: suspended, disabled: false},
    {value: "completed", title: completed, disabled: false},
    {value: "externallyTerminated", title: externallyTerminated, disabled: false},
    {value: "internallyTerminated", title: internallyTerminated, disabled: false},
    {value: "withIncidents", title: withIncidents, disabled: false},
    {value: "startedBefore", title: startedBefore, disabled: false},
    {value: "startedAfter", title: startedAfter, disabled: false},
    {value: "finishedBefore", title: finishedBefore, disabled: false},
    {value: "finishedAfter", title: finishedAfter, disabled: false},
    {value: "custom", title: custom, disabled: false}];

const trueProps = ["finished", "unfinished", "active", "suspended", "completed", "externallyTerminated", "internallyTerminated", "withIncidents"];
const dateTimeProps = ['startedBefore', 'startedAfter', 'finishedBefore', 'finishedAfter'];

let hasNextPageData = true;
let validSearchCriteria = true;

export default [
    {
        id: "history-list",
        pluginPoint: "cockpit.processDefinition.runtime.tab",
        priority: 5,
        label: "History",
        render: (container, {api}) => {

            const hash = window?.location?.hash ?? '';
            let splitUrl = hash.split("/");
            globalProcessDefinitionId = splitUrl[splitUrl.findIndex((elem) => elem === "process-definition") + 1];
            globalAPI = api;

            fields.forEach(val => val.disabled = false);

            currRequestBody = {
                "sorting": [
                    {
                        "sortBy": "startTime",
                        "sortOrder": "desc"
                    }
                ]
            }
            currRequestBody.processDefinitionId = globalProcessDefinitionId;

            $(container).addClass("container-fluid");

            container.appendChild(renderSearchBar(api, container));
            container.appendChild(renderHistoryTable(api, globalEndpoint, currRequestBody));
            container.appendChild(renderPaginator(api, container));
        }
    }
];

function addSearchWidget(searchContainer) {

    const row = $(document.createElement('div')).prop({
        class: 'row',
        style: 'margin-right: 10px; margin-bottom: 5px;'
    });

    const div = $(document.createElement('div')).prop({
        class: 'form-group form-control-sm wc col-12'
    });

    const select = $(document.createElement('select')).prop({
        name: 'fields',
        class: 'form-control form-control-sm fields',
        style: 'width: 260px;'
    });

    let operator = $(document.createElement('select')).prop({
        name: 'operators',
        class: 'form-control form-control-sm operators',
        disabled: 'disabled'
    });

    operator.append($(document.createElement('option')).prop({
        value: 'eq',
        text: '=',
        title: 'eq'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'neq',
        text: '!=',
        title: 'neq'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'gt',
        text: '>',
        title: 'gt'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'gteq',
        text: '>=',
        title: 'gteq'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'lt',
        text: '<',
        title: 'lt'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'lteq',
        text: '<=',
        title: 'lteq'
    }));

    operator.append($(document.createElement('option')).prop({
        value: 'like',
        text: 'like',
        title: 'like'
    }));

    const input = $(document.createElement('input')).prop({
        class: 'form-control form-control-sm values',
        style: 'width: 250px;'
    });

    select.click(function () {

        const prevField = $(this).data('prev');
        $(this).empty();
        $(this).data('prev', prevField);

        for (const val of fields) {
            if (!val.disabled || val.value === prevField) {
                $(this).append($(document.createElement('option')).prop({
                    value: val.value,
                    text: val.value,
                    title: val.title,
                    //disabled: val.disabled,
                    selected: prevField === val.value
                }));
            }
        }
    }).change(function () {

        const paramVal = $(this).val();
        const isTrueProp = trueProps.includes(paramVal);
        const isDateTimeProp = dateTimeProps.includes(paramVal);

        if($(this).data('prev')) {
            fields.find(fl => fl.value === $(this).data('prev')).disabled = false;
        }
        $(this).data('prev', paramVal);

        if (paramVal === 'variables') {

            restSearchBarFields($(this));
            $(this).next().after(input);

            $(this).after($(document.createElement('input')).prop({
                class: 'form-control form-control-sm variableKey',
                style: 'width: 250px;'
            }));
            operator.removeAttr('disabled');

        } else if (paramVal === 'custom') {

            restSearchBarFields($(this));

            const textArea = $(document.createElement('textarea')).prop({
                class: 'form-control form-control-sm values',
                rows: "1",
                style: "min-width: 250px;max-width:1000px;"
            });

            $(this).next().after(textArea);

            $(this).after($(document.createElement('input')).prop({
                class: 'form-control form-control-sm variableKey',
                style: 'width: 250px;'
            }));

            operator.val('eq');
            operator.prop({
                disabled: 'disabled'
            });

        } else if (paramVal === 'sorting') {

            restSearchBarFields($(this));
            $(this).next().after(input);

            $(this).after($(document.createElement('input')).prop({
                class: 'form-control form-control-sm variableKey',
                style: 'width: 250px;'
            }));

            operator.val('eq');
            operator.prop({
                disabled: 'disabled'
            });

        } else if (isTrueProp) {

            restSearchBarFields($(this));

            let trueFalseOperator = $(document.createElement('select')).prop({
                name: 'operators',
                class: 'form-control form-control-sm trueFalseOperator',
                style: 'width: 250px;'
            });

            trueFalseOperator.append($(document.createElement('option')).prop({
                value: "true",
                text: "true",
                title: "true"
            }));

            $(this).next().after(trueFalseOperator);

            operator.val('eq');
            operator.prop({
                disabled: 'disabled'
            });

            fields.find(fl => fl.value === paramVal).disabled = true;

        } else if (isDateTimeProp) {

            restSearchBarFields($(this));

            let dateTimeInput = $(document.createElement('input')).prop({
                class: 'form-control form-control-sm dateTimeVal',
                type: 'datetime-local',
                style: 'width: 250px;'
            });

            $(this).next().after(dateTimeInput);

            operator.val('eq');
            operator.prop({
                disabled: 'disabled'
            });

            fields.find(fl => fl.value === paramVal).disabled = true;

        } else {

            restSearchBarFields($(this));
            $(this).next().after(input);

            operator.val('eq');
            operator.prop({
                disabled: 'disabled'
            });

            if(paramVal !== "") {
                fields.find(fl => fl.value === paramVal).disabled = true;
            }
        }
    });

    for (const val of fields) {
        if (!val.disabled) {
            select.append($(document.createElement('option')).prop({
                value: val.value,
                text: val.value,
                title: val.title,
                disabled: val.disabled
            }));
        }
    }

    const remove = $(document.createElement('button')).prop({
        type: 'button',
        innerHTML: 'X',
        class: 'btn btn-danger',
        style: 'margin-left: 5px;'
    });

    remove.click(function () {

        const paramVal = $(this).parent().find('.fields').val();
        fields.find(fl => fl.value === paramVal).disabled = false;

        if ($(searchContainer).children().children().filter('.wc').length === 1) {
            $(this).parent().remove();
            $(searchContainer).append(addSearchWidget(searchContainer));
        } else {
            $(this).parent().remove();
        }
    });

    row.append(div).append(select).append(operator).append(input).append(remove);

    return row;
}

function restSearchBarFields(thisElement) {

    $(thisElement).parent().children().each((index, val) => {
        const classAttr = $(val).attr("class");

        if (classAttr.includes("variableKey")) {
            $(val).remove();
        } else if (classAttr.includes("dateTimeVal")) {
            $(val).remove();
        } else if (classAttr.includes("trueFalseOperator")) {
            $(val).remove();
        } else if (classAttr.includes("values")) {
            $(val).remove();
        }
    });
}

function renderSearchBar(api) {
    const parentSearchContainer = document.createElement("div");
    parentSearchContainer.id = "parentsearchcontainer";
    parentSearchContainer.style.float = "right";

    const searchContainer = $(document.createElement('form')).prop({
        id: 'searchcontainer',
        class: 'form-inline'
    });

    $(parentSearchContainer).append(searchContainer);

    const addButton = $(document.createElement('button')).prop({
        type: 'button',
        id: 'add',
        innerHTML: 'Add',
        class: 'btn btn-primary',
        style: 'margin-left: 5px;',
        title: 'Add multiple parameters to search by'
    });

    $(addButton).click(function () {
        $(searchContainer)
            .append(
                addSearchWidget(searchContainer)
            )
    });

    const downloadButton = $(document.createElement('button')).prop({
        type: 'button',
        id: 'download',
        innerHTML: 'Download',
        class: 'btn btn-primary',
        style: 'margin-left: 5px;',
        title: 'Download search results as a CSV format'
    });

    $(downloadButton).click(function () {
        tableToCSV();
    });

    const searchButton = $(document.createElement('button')).prop({
        type: 'button',
        id: 'search',
        innerHTML: 'Search',
        class: 'btn btn-primary',
        style: 'margin-left: 5px;'
    });

    $(searchButton).click(function () {

        //Reset all the parameters back to default
        currFirstResult = globalFirstResult;
        currMaxResult = globalMaxResults;
        currRequestBody = {
            "sorting": [
                {
                    "sortBy": "startTime",
                    "sortOrder": "desc"
                }
            ]
        }
        currRequestBody.processDefinitionId = globalProcessDefinitionId;
        $("#currPageVal").data("page", currFirstResult).text(1);

        validSearchCriteria = true;

        $(searchContainer).children().each(function () {

            const key = $(this).find('.fields').val();
            let value = $(this).find('.values').val();

            const trueVal = $(this).find('.trueFalseOperator').val();
            const dateTimeVal = $(this).find('.dateTimeVal').val();

            const isTrueProp = trueProps.includes(key);
            const isDateTimeProp = dateTimeProps.includes(key);

            if (!featureBlacklist.includes(key)) {
                if (key === '') {

                    const numOfBlankSelectionFields = $(searchContainer).children().filter(function () {
                        return $(this).find('.fields').val() === "";
                    }).length;
                    const isFirstChildBlankSelectionField = $(searchContainer).children().eq(0).find('.fields').val() === "";

                    if (!isFirstChildBlankSelectionField || $(searchContainer).children().length > 1 || numOfBlankSelectionFields > 1 || value !== "") {
                        validSearchCriteria = false;
                        alert(`Blank search field(s). Remove or select an appropriate field and value`);
                        return false;
                    }

                } else if (key === 'variables') {

                    const variableName = $(this).find('.variableKey').val();
                    const variableOperator = $(this).find('.operators').val();

                    if (currRequestBody.variables === undefined) {
                        currRequestBody.variables = [];
                    }
                    const variableFoundIndex = currRequestBody.variables.findIndex(val => val.name === variableName);

                    if (variableName !== "") {
                        if (variableFoundIndex === -1) {

                            const fk = {};
                            fk.name = variableName;
                            fk.operator = variableOperator;

                            if (variableOperator === "like") {
                                fk.value = `%${value}%`;
                            } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                                fk.value = (value.toLowerCase() === 'true');
                            } else {
                                fk.value = value;
                            }

                            currRequestBody.variables.push(fk);

                        } else {
                            validSearchCriteria = false;
                            alert(`Duplicate variable not allowed`);
                            return false;
                        }

                    } else {
                        validSearchCriteria = false;
                        alert(`Variable name value is empty`);
                        return false;
                    }

                } else if (key === 'sorting') {

                    const sortBy = $(this).find('.variableKey').val();

                    if (currRequestBody.sorting === undefined) {
                        currRequestBody.sorting = [];
                    }
                    const sortByFoundIndex = currRequestBody.sorting.findIndex(val => val.sortBy === sortBy);

                    if (sortBy !== "") {
                        if (value !== "") {
                            if (sortByFoundIndex === -1) {

                                const fk = {};
                                fk.sortBy = sortBy;
                                fk.sortOrder = value;

                                currRequestBody.sorting.push(fk);

                            } else {
                                validSearchCriteria = false;
                                alert(`Duplicate sortBy not allowed`);
                                return false;
                            }

                        } else {
                            validSearchCriteria = false;
                            alert(`Sorting value is empty`);
                            return false;
                        }

                    } else {
                        validSearchCriteria = false;
                        alert(`sortBy value is empty`);
                        return false;
                    }

                } else if (key === 'custom') {

                    const customParam = $(this).find('.variableKey').val();
                    const customParamFound = currRequestBody.hasOwnProperty(customParam);

                    if (customParam !== "") {
                        if (value !== "") {
                            if (!customParamFound) {
                                if (!featureBlacklist.includes(customParam)) {
                                    if (featureList.includes(customParam)) {

                                        if (customParam === "firstResult" && value !== "" && !isNaN(value)) {
                                            currFirstResult = value;
                                        } else if (customParam === "firstResult" && (value === "" || isNaN(value))) {
                                            validSearchCriteria = false;
                                            alert(`firstResult value is not valid`);
                                            return false;
                                        }

                                        if (customParam === "maxResults" && value !== "" && !isNaN(value)) {
                                            currMaxResult = value;
                                        } else if (customParam === "maxResults" && (value === "" || isNaN(value))) {
                                            validSearchCriteria = false;
                                            alert(`maxResults value is not valid`);
                                            return false;
                                        }

                                        if (customParam !== "firstResult" && customParam !== "maxResults") {
                                            currRequestBody[customParam] = returnJSONObjectOrString(value);
                                        }

                                    } else {
                                        validSearchCriteria = false;
                                        alert(`Feature ${customParam} does not exist`);
                                        return false;
                                    }

                                } else {
                                    validSearchCriteria = false;
                                    alert(`Blacklisted feature ${customParam} not allowed`);
                                    return false;
                                }

                            } else {
                                validSearchCriteria = false;
                                alert(`Feature ${customParam} already exists in current request body`);
                                return false;
                            }

                        } else {
                            validSearchCriteria = false;
                            alert(`Custom value is empty`);
                            return false;
                        }

                    } else {
                        validSearchCriteria = false;
                        alert(`Custom parameter is empty`);
                        return false;
                    }

                } else if (isTrueProp) {

                    if (trueVal !== "") {
                        currRequestBody[key] = trueVal;
                    } else {
                        validSearchCriteria = false;
                        alert(`${key} True value is empty`);
                        return false;
                    }

                } else if (isDateTimeProp) {

                    if (dateTimeVal !== "") {
                        currRequestBody[key] = `${dateTimeVal}:00.000+0200`;
                    } else {
                        validSearchCriteria = false;
                        alert(`${key} DateTime value is empty`);
                        return false;
                    }

                } else if (key !== "" && !isTrueProp && !isDateTimeProp) {

                    if (value !== "") {
                        if (key === "processInstanceBusinessKeyLike"
                            || key === "processDefinitionNameLike"
                            || key === "incidentMessageLike") {
                            value = `%${value}%`;
                        }

                        currRequestBody[key] = returnJSONObjectOrString(value);

                    } else {
                        //Be able to delete default parameters if they are added in custom with empty value
                        //delete currRequestBody[key];
                        validSearchCriteria = false;
                        alert(`${key} value is empty`);
                        return false;
                    }

                }

            } else {
                validSearchCriteria = false;
                alert(`Blacklisted feature ${key} not allowed`);
            }

        });

        if (validSearchCriteria) {
            populateHistoryTable(api, globalEndpoint, currRequestBody);
        } else {
            populateOrReplaceTable("");
        }

    });

    const div = $(document.createElement('div')).prop({
        class: 'col-12'
    }).append(downloadButton).append(addButton).append(searchButton);

    const row = $(document.createElement('div')).prop({
        class: 'row',
        style: 'margin-right: 10px; margin-bottom: 5px; margin-top: 10px; float:right;'
    }).append(div);

    $(parentSearchContainer).append(row);

    $(searchContainer)
        .append(
            addSearchWidget(searchContainer)
        );

    return parentSearchContainer;
}

function renderHistoryTable(api, endpoint, parameters) {

    const historyTable = document.createElement("div");
    historyTable.id = "history-table";

    populateHistoryTable(api, endpoint, parameters);

    return historyTable;
}

function renderPaginator(api, container) {

    const paginator = document.createElement("div");
    paginator.id = "paginator";

    $(paginator).append(`<div class="row">
                            <div class="col-12">
                                <nav aria-label="Page navigation example">
                                  <ul class="pagination">
                                    <li class="page-item">
                                      <button class="page-link btn" id="prevPage" role="button" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span class="sr-only">Previous</span>
                                      </button>
                                    </li>   
                                    <li class="page-item"><a class="btn disabled" id="currPageVal" data-page="${globalFirstResult}">1</a></li>
                                    <li class="page-item">
                                      <button class="page-link btn" id="nextPage" role="button" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span class="sr-only">Next</span>
                                      </button>
                                    </li>
                                  </ul>
                                </nav>
                            </div>
                        </div>`);

    $(container).on("click", "#prevPage", (event) => {

        event.preventDefault();
        event.stopPropagation();

        let currentPageElem = $("#currPageVal");

        if (currentPageElem.data("page") > 0 && validSearchCriteria) {
            let nextPage = currentPageElem.data("page") - 1;

            currentPageElem.data("page", nextPage);
            let currentPageVal = document.getElementById("currPageVal");
            currentPageVal.setAttribute("data-page", nextPage);
            currentPageElem.text(nextPage + 1);
            currFirstResult = (nextPage * globalMaxResults);

            populateHistoryTable(api, globalEndpoint, currRequestBody);
        }

    }).on("click", "#nextPage", (event) => {

        event.preventDefault();
        event.stopPropagation();

        if (hasNextPageData && validSearchCriteria) {
            let currentPageElem = $("#currPageVal");
            let nextPage = currentPageElem.data("page") + 1;

            currentPageElem.data("page", nextPage);
            let currentPageVal = document.getElementById("currPageVal");
            currentPageVal.setAttribute("data-page", nextPage);
            currentPageElem.text(nextPage + 1);
            currFirstResult = (nextPage * globalMaxResults);

            populateHistoryTable(api, globalEndpoint, currRequestBody);
        }
    });

    return paginator;
}

function populateHistoryTable(api, endpoint, requestBody) {
    callProcessInstance(api, endpoint, requestBody)
        .then((data) => {

            let tableData = data.map((result, index) => {
                return [
                    {th: (currFirstResult + (index + 1))},
                    {text: result.state},
                    {
                        a: {href: `#/history/process-definition-id/${result.processDefinitionId}/process-instance/${result.id}`},
                        text: result.id,
                    },
                    {text: result.startTime},
                    {text: result.endTime},
                    {text: result.businessKey}
                ];
            });

            populateOrReplaceTable(tableData);

            hasNextPageData = tableData.length > 0;

        }).catch((error) => {
        console.log(error);
        populateOrReplaceTable("");
        alert(returnErrorAlertMsg(error.responseText));
    });
}

function populateOrReplaceTable(tableData) {

    const tableHeadings = ["#", "State", "Process Id", "Start Time", "End Time", "Business Key"];
    const oldChild = document.getElementById("history.table");
    const historyTable = document.getElementById("history-table");

    if (oldChild) {
        historyTable.replaceChild(createPluginTable("history.table", tableHeadings, tableData), oldChild);
    } else {
        historyTable.appendChild(createPluginTable("history.table", tableHeadings, tableData));
    }
}

function returnErrorAlertMsg(err) {
    try {
        JSON.parse(err);
    } catch (e) {
        return `Error: ${err}`;
    }
    return JSON.stringify(JSON.parse(err), null, '\t')
}

function returnJSONObjectOrString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return str;
    }
    return JSON.parse(str);
}

function createPluginTable(tableID, tableHeadings, tableData) {

    let thead = "";
    tableHeadings.forEach((label) => {
        thead += `<th scope="col">${label}</th> \n`;
    });

    let tbody = "";
    if (tableData !== "") {
        tableData.forEach((row) => {
            tbody += `<tr> \n`;
            row.forEach((data) => {
                if (data.th) {
                    tbody += `<th scope="row">${data.th}</th> \n`;
                } else if (data.a) {
                    tbody += `<td><a href="${data.a.href}">${data.text}</a></td> \n`;
                } else {
                    tbody += `<td>${data.text}</td> \n`;
                }
            });
            tbody += `<tr> \n`;
        });
    }

    const historyTable = document.createElement("div")
    historyTable.id = tableID;
    $(historyTable).append(`<div class="row">
                                <div class="col-12">
                                    <table class="table table-hover" id="historyTableID">
                                      <thead>
                                        <tr>
                                          ${thead}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        ${tbody}
                                      </tbody>
                                    </table>
                                </div>
                            </div>`);

    return historyTable;
}

function callProcessInstance(api, endpoint, requestBody) {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: api.engineApi + `${endpoint}?firstResult=${currFirstResult}&maxResults=${currMaxResult}`,
            data: JSON.stringify(requestBody),
            dataType: "json",
            headers: {
                'X-XSRF-TOKEN': getCookie("XSRF-TOKEN"),
                'Content-Type': 'application/json'
            },
            success: (data) => {
                resolve(data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}

function tableToCSV() {

    if (validSearchCriteria) {
        const csvFileHeadings = [`#, State, Process ID, Business Key, Start time, End time, Process instance link`];

        callProcessInstance(globalAPI, globalEndpoint, currRequestBody)
            .then((data) => {

                let csv_data = data.map((result, index) => {
                    return [(currFirstResult + (index + 1)),
                        result.state,
                        result.id,
                        result.businessKey,
                        result.startTime,
                        result.endTime,
                        `${window.location.origin}${window.location.pathname}#/history/process-definition-id/${result.processDefinitionId}/process-instance/${result.id}`,
                    ].join(",");
                });

                downloadCSVFile(csvFileHeadings.concat(csv_data).join("\n"));
            });
    } else {
        alert(`Unable to download invalid search result`);
    }
}

function downloadCSVFile(csv_data) {

    let CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    const temp_link = document.createElement('a');
    temp_link.download = "CamundaHistoryExport.csv";
    temp_link.href = window.URL.createObjectURL(CSVFile);
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
}
*/
