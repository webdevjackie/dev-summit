dojo.addOnLoad(function() {
    require([
        'customizations/GetAnnouncementsConfig',
        'customizations/announcements/Dialog'
    ], function(GetAnnouncementsConfig, Dialog) {
        GetAnnouncementsConfig.loadConfig(function(config) {
            Dialog.init(config);
        });
    });
});