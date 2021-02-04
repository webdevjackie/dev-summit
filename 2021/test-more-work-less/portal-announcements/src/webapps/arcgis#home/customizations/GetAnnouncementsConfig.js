define(['dojo/query',
    'dojo/json',
    'dojo/_base/lang',
    'esri/arcgis/utils',
    'esri/request'],
function(
    query,
    JSON,
    lang
) {
    const clazz = {
        loadConfig: function(callback) {
            const nodeList = query('.announcementsConfig');
            if (!nodeList.length) {
                window.setTimeout(lang.hitch(this, this.loadConfig, callback), 500);
            } else {
                const config = JSON.parse(nodeList[0].innerText);

                callback(config);
            }
        }
    };

    return clazz;
});
