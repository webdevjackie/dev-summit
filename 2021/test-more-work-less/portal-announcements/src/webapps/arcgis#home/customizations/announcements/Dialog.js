define([
  'dojo/cookie',
  'dojo/on',
  'dojo/dom-construct',
  'dojo/date/locale',
  'dojo/query',
  'dojo/_base/lang',
  "dojo/dom",
  'dijit/Dialog',
  'dijit/form/Button',
  'xstyle/css!./Dialog.css',
], function(
    cookie,
    on,
    domConstruct,
    locale,
    query,
    lang,
	  dom,
    Dialog,
    Button
) {
  const clazz = {
    dialog: {},
    config: {},
    showAnnouncements: false,

    init: function(config) {
      let portalHomeUrl;
      if (!window.esriGeowConfig) {
        const baseUrlLength = (window.location.protocol + window.location.host + '/').length + 1;
        const contextIndex = window.location.href.indexOf('/', baseUrlLength + 1);
        portalHomeUrl = window.location.href.substring(0, contextIndex) + '/home';
      } else {
        portalHomeUrl = esriGeowConfig.baseUrl;
        // if portalHomeUrl now has a trailing slash, delete it for consistency with the above code
        if (portalHomeUrl.indexOf('/', portalHomeUrl.length - 1) !== -1) {
          portalHomeUrl = portalHomeUrl.slice(0, -1);
        }
      }

      const announcementConfig = config.announcementDialog;
      const announcementList = announcementConfig.announcements;
      
	    this.topNavSearchNode = query('.esri-header-client')[0];
	 
	  
      if (!this.topNavSearchNode) {
        window.setTimeout(lang.hitch(this, this.init, config), 500);
      } else {
        if (!this.announcementsButton) {
          this.setupAnnouncementsBtn();
        }
  
        this.config = config;
  
        if (announcementList.length > 0) {
          let maxDate = 0;
          const announcementParent = domConstruct.create('div', {
            class: 'announcement-parent',
          });
          const announcementContent = domConstruct.create(
              'div',
              {class: 'announcement-content'},
              announcementParent
          );
          for (let i = 0; i < announcementList.length; i++) {
            const announcementItem = announcementList[i];
            const date = locale.parse(announcementItem.date, {
              selector: 'date',
              datePattern: announcementConfig.datePattern,
            });
            const dateValue = date.valueOf();
            if (dateValue > maxDate) {
              maxDate = dateValue;
            }
            const announcementDiv = domConstruct.create(
                'div',
                {class: 'announcement'},
                announcementContent
            );
            const announcementTitle = domConstruct.create(
                'div',
                {class: 'title', innerHTML: announcementItem.title},
                announcementDiv
            );
            domConstruct.create(
                'span',
                {class: 'date', innerHTML: announcementItem.date},
                announcementTitle
            );
            domConstruct.create(
                'div',
                {class: 'description', innerHTML: announcementItem.description},
                announcementDiv
            );
          }
  
          const announcementCheckbox = domConstruct.create(
              'input',
              {type: 'checkbox', id: 'announcementCheckbox'},
              announcementParent
          );
          domConstruct.create(
              'label',
              {
                for: 'announcementCheckbox',
                innerHTML: announcementConfig.neverShowText,
              },
              announcementParent
          );
          domConstruct.create('br', {}, announcementParent);
          domConstruct.create('br', {}, announcementParent);
          const button = new Button(
              {label: 'Close'},
              domConstruct.create('div', {}, announcementParent)
          );

          this.dialog = new Dialog({
            title: announcementConfig.title,
            content: announcementParent,
            width: '75%',
          });
  
          const cookieDate = cookie('lastAnnouncementDate');
          if (!cookieDate || maxDate > cookieDate || this.showAnnouncements) {
            this.show();
          }
  
          on(button, 'click', lang.hitch(this, function() {
            this.dialog.hide();
          }));
  
          on(this.dialog, 'hide', lang.hitch(this, function() {
            if (announcementCheckbox.checked) {
              cookie('lastAnnouncementDate', maxDate);
            }
          }));
        } else {
          // Add check for no active announcements
          this.dialog = new Dialog({
            title: 'No Active Announcements',
            content: 'There are no active announcements at this time.',
            width: '75%',
          });
        }
      }
    },
    setupAnnouncementsBtn: function() {
      const megaphoneIcon = "<div class='esri-header-announcements' id='announcements-btn-id'>" +
      "<button class='esri-header-announcements-control top-nav-link' id='esri-header-announcements-control'><span class=''>" +
      "<svg class='esri-header-announcements-image' role='presentation' style='transform: rotate(360deg);' id='esri-header-notifications-image' viewBox='0 0 16 16'>" + 
      "<path d='M14.5 1.865a1 1 0 0 0-1 .001c-7.573 4.373-3.743 2.161-6.93 4A.995.995 0 0 1 6.072 6H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v2a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2h.071a1 1 0 0 1 .5.133l6.929 4.001a1 1 0 0 0 1.5-.865V2.731a1 1 0 0 0-.5-.866zM5 12H2v-2h3zm9 1.268l-6.93-4A2.001 2.001 0 0 0 6.072 9H1V7h5.071a1.994 1.994 0 0 0 1.002-.269L14 2.732z'>" + 
      "</path></svg></span></button></div>";

      this.announcementsButton = domConstruct.toDom(megaphoneIcon);
      if (window.location.href.indexOf('viewer.html') === -1) {
          domConstruct.place(this.announcementsButton, this.topNavSearchNode, 'before');
      } else {
      domConstruct.place(this.announcementsButton, this.topNavSearchNode, 'after');  
      }

      on(this.announcementsButton, 'click', lang.hitch(this, function() {
        this.showAnnouncements = true;
        this.show();
      }));
    },
    show: function() {
      this.dialog.show();
      window.setTimeout(lang.hitch(this, function() {
        this.dialog.resize();
      }), 250);
    },
  };

  return clazz;
});
