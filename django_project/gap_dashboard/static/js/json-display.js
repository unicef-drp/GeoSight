function jsonSampleToDisplay(json, chainKey, suffix, isJsonValue) {
    if (json === undefined) {
        return ""
    }
    if (!suffix) {
        suffix = '';
    }
    if (json.constructor === String) {
        return `"${json}"` + suffix
    } else if (json.constructor === Number) {
        return json + suffix
    } else if (json.constructor === Array) {
        let arrayClass = "";
        if (json[0] && json[0].constructor === Object) {
            arrayClass = "array"
        }
        return "" +
            "<div>" +
            (!isJsonValue ? `<span class='${arrayClass}' data-keys='${chainKey}'>[</span>` : "") +
            "   <div class='content'>" + jsonSampleToDisplay(json[0], chainKey + `[0]`) + "</div>" +
            (!isJsonValue ? "<div>] </div>" : "") +
            "</div>"
    } else if (json.constructor === Object) {
        const rows = []
        $.each(json, function (key, value) {
            if (!value) {
                return
            }
            let prefix = ""
            let comma = ""
            let presuffix = ""
            const currentChainKey = chainKey + `["${key}"]`;
            if (value.constructor === Array) {
                let arrayClass = "";
                if (value[0] && value[0].constructor === Object) {
                    arrayClass = "array"
                }
                prefix = `<span class="${arrayClass}" data-keys='${currentChainKey}'>[</span>`
                presuffix = "]"
                comma = ","
            } else if (value.constructor === Object) {
                prefix = "{";
                presuffix = "}";
                comma = ",";
            }
            rows.push(
                `<div><span class='key' data-keys='${currentChainKey}'>"${key}"</span>&nbsp:&nbsp` + prefix +
                jsonSampleToDisplay(value, currentChainKey, ',', true) +
                "   </div>" +
                (presuffix ? "<div>" + presuffix + comma + "</div>" : "")
            )
        });
        return (!isJsonValue ? "<div>{</div>" : "") +
            "   <div class='content'>" + rows.join("") + "</div>" +
            (!isJsonValue ? "<div>} </div>" : "")
    }
    return ""
}