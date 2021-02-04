import AnnouncementUtils from '../../utils/announcementUtilities';

it('cleans up html, and whitespace in portal description', () => {
    const dirtyDescription = "<div class=\"config\" style=\"display:none\"> {     \"helpLink\": \"https://www.arcgis.com\",     \"announcementDialog\": {         \"title\": \"Announcements\",         \"closeButtonText\": \"Close\",         \"neverShowText\": \"Don't show this again until there is a new announcement.\",         \"datePattern\": \"M/dd/yyyy h:ma\",         \"announcements\": [{\"date\":\"01/31/2017 2:50PM\",\"title\":\"&lt;span style='color:red'&gt;TEST&lt;/span&gt;\",\"description\":\"TESTTESTfajwnefkjhna gaelrkjgn lakjren glkjna lekrjn glkja nerkljf nlakjre nlgkjn alkjren gkljan erlkjn lakjenr tkljn alkjn rtlkj nawklejn rlkajw nelkrj nakljwen rklj anwkljenr kljawn elkrj nalwkejr nlkajwn eklrjn TEST\"},{\"date\":\"2/15/2019 7:52AM\",\"title\":\"&lt;span style=&#39;color:red&#39;&gt;test double quotes&lt;/span&gt;\",\"description\":\"&lt;b&gt;fails&lt;/b&gt;. will not show color in announcements manager, will break portal homepage announcements.\"},{\"date\":\"2/15/2019 9:59AM\",\"title\":\"&lt;span style=&#39;color: purple&#39;&gt; muahaha fixed &lt;/span&gt;\",\"description\":\"are double quotes fixed with the new util function?\"},{\"date\":\"2/15/2019 10:00AM\",\"title\":\"what if i get fancy and put a \\ before the double quotes?\",\"description\":\"let&#39;s see: &lt;span style=&#39;color: pink&#39;&gt;did this work?&lt;/span&gt; The monkey said, &#39;Hello!&#39;\"},{\"date\":\"2/15/2019 10:04AM\",\"title\":\"&lt;a href=&#39;https://www.google.com&#39;&gt;Let&#39;s go to Google!&lt;/a&gt;\",\"description\":\"This assumes that the writer of the announcement uses html tags correctly.... \"}]},     \"search\": {             \"title\": \"Explore the Portal\",             \"description\": \"Search for topics or missions such as Syria, missiles, or mobility\",             \"searchLink\": \"\"     },     \"getStarted\": {         \"title\": \"Get Started!\",         \"icons\":{             \"group-ownership\": {                     \"text\": \"Learn about Groups and how to Share Ownership\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"story-maps\": {                     \"text\": \"Create a Story Map or web app using a template\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"geocoder\": {                     \"text\": \"Use the Geocoder to find locations by name or address\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"portal-blog\": {                     \"text\": \"Portal Blog: What's New, Tips &amp; Tricks\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"web-map\": {                     \"text\": \"Create a Web Map\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"examples\": {                     \"text\": \"Look at interesting examples\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"geoint-services\": {                     \"text\": \"GEOINT Services\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"hot-topics\": {                     \"text\": \"Hot Topics\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             },             \"dev-tools\": {                     \"text\": \"Dev Tools\",                     \"link\": \"https://www.esri.com\",                     \"visible\": true             }                      }     },     \"browseData\": {             \"visible\": false,             \"title\": \"Browse Data by Categories\",             \"categories\": [                 {\"name\": \"Farming\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Biota\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Boundaries\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Climatology / Meteorology / Atmosphere\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Economy\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Elevation\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Environment\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Geoscientific Information\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Health\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Imagery Base Maps Earth Cover\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Intelligence Military\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Inland Waters\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Location\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Oceans\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Planning Adastre\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Society\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Structure\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Transportation\", \"link\": \"https://www.google.com\"},                 {\"name\": \"Utilities Communication\", \"link\": \"https://www.google.com\"}             ]     } }  </div>";
    const cleanDescription = "[{\"date\":\"01/31/2017 2:50PM\",\"title\":\"&lt;span style='color:red'&gt;TEST&lt;/span&gt;\",\"description\":\"TESTTESTfajwnefkjhna gaelrkjgn lakjren glkjna lekrjn glkja nerkljf nlakjre nlgkjn alkjren gkljan erlkjn lakjenr tkljn alkjn rtlkj nawklejn rlkajw nelkrj nakljwen rklj anwkljenr kljawn elkrj nalwkejr nlkajwn eklrjn TEST\"},{\"date\":\"2/15/2019 7:52AM\",\"title\":\"&lt;span style=&#39;color:red&#39;&gt;test double quotes&lt;/span&gt;\",\"description\":\"&lt;b&gt;fails&lt;/b&gt;. will not show color in announcements manager, will break portal homepage announcements.\"},{\"date\":\"2/15/2019 9:59AM\",\"title\":\"&lt;span style=&#39;color: purple&#39;&gt; muahaha fixed &lt;/span&gt;\",\"description\":\"are double quotes fixed with the new util function?\"},{\"date\":\"2/15/2019 10:00AM\",\"title\":\"what if i get fancy and put a \\ before the double quotes?\",\"description\":\"let&#39;s see: &lt;span style=&#39;color: pink&#39;&gt;did this work?&lt;/span&gt; The monkey said, &#39;Hello!&#39;\"},{\"date\":\"2/15/2019 10:04AM\",\"title\":\"&lt;a href=&#39;https://www.google.com&#39;&gt;Let&#39;s go to Google!&lt;/a&gt;\",\"description\":\"This assumes that the writer of the announcement uses html tags correctly.... \"}]";

    let fixedDescription = AnnouncementUtils.removeHTML(dirtyDescription);
    fixedDescription = AnnouncementUtils.removeWhitespace(fixedDescription);

    expect(fixedDescription).toEqual(cleanDescription);
});

it('changes double quotes in announcement to single quotes', () => {
    const dirtyQuotes = "\"announcementDialog\":";
    const cleanQuotes = "'announcementDialog':";

    const fixedDescription = AnnouncementUtils.fixDoubleQuotes(dirtyQuotes);

    expect(fixedDescription).toEqual(cleanQuotes);
});

it('changes escaped double quotes in announcement to single quotes', () => {
    const dirtyQuotes = "this title has \"escaped double quotes";
    const cleanQuotes = "this title has 'escaped double quotes";

    const fixedDescription = AnnouncementUtils.fixDoubleQuotes(dirtyQuotes);

    expect(fixedDescription).toEqual(cleanQuotes);
});

it('removes html elements when there are 0 announcements', () => {
    const dirtyHTML = "<div class=\"config\" style=\"display: none\"> { \"announcementDialog\": \"announcementDialog\": { \"title\": \"Announcements\", \"closeButtonText\": \"Close\", \"neverShowText\": \"Don't show this again until there is a new announcement.\",\"datePattern\": \"M/dd/yyyy h:ma\", \"announcements\": [ ], \"search\":     }   } </div>";
    const cleanHTML = "[ ]";

    const fixedDescription = AnnouncementUtils.removeHTML(dirtyHTML);

    expect(fixedDescription).toEqual(cleanHTML);
});

it('removes html elements when there are 1 or more announcements', () => {
    const dirtyHTML = "<div class=\"config\" style=\"display: none\"> { \"announcementDialog\": \"announcementDialog\": { \"title\": \"Announcements\", \"closeButtonText\": \"Close\", \"neverShowText\": \"Don't show this again until there is a new announcement.\",\"datePattern\": \"M/dd/yyyy h:ma\", \"announcements\": [ {\"date\": \"01/31/2017 2:00PM\", \"title\": \"Known Issue\", \"description\": \"Living Atlas functionality will be broken forever\"} ], \"search\":     }   } </div>";
    const cleanHTML = "[ {\"date\": \"01/31/2017 2:00PM\", \"title\": \"Known Issue\", \"description\": \"Living Atlas functionality will be broken forever\"} ]";

    const fixedDescription = AnnouncementUtils.removeHTML(dirtyHTML);

    expect(fixedDescription).toEqual(cleanHTML);
});

it('removes >=2 consecutive whitespace chars', () => {
    const dirtyWhitespace = "\"title\": \"October   Spooky Time\",           \"description\": \"Spooky   Mr.      Skelta";
    const cleanWhitespace = "\"title\": \"October Spooky Time\", \"description\": \"Spooky Mr. Skelta";

    const fixedDescription = AnnouncementUtils.removeWhitespace(dirtyWhitespace);

    expect(fixedDescription).toEqual(cleanWhitespace);
});

it('formats date', () => {
    const dirtyDate = new Date('Fri Jan 25 2019 14:47:16 GMT-0500 (Eastern Standard Time)');
    const cleanDate = '1/25/2019 2:47PM';

    const formattedDate = AnnouncementUtils.formatDate(dirtyDate);

    expect(formattedDate).toEqual(cleanDate);
});

it('builds an announcement object', () => {
    const title = 'Test Title';
    const description = 'Test description';
    const date = '1/25/2019 1:02PM';
    const builtAnnouncement = {
        title,
        description,
        date
    }; 

    const announcement = AnnouncementUtils.buildAnnouncement(title, description, date);

    expect(builtAnnouncement).toEqual(announcement);
});

it('add announcement to portal description', () => {
    const title = 'Test Title';
    const description = 'Test description';
    const date = '1/25/2019 1:02PM';
    const builtAnnouncement = {
        title,
        description,
        date
    }; 

    const currList = "\"announcements\": [{\"date\":\"01/31/2017 2:50PM\",\"title\":\"orig title\",\"description\":\"orig description\"}]";

    const updatedAnnouncementsList = AnnouncementUtils.addAnnouncement(builtAnnouncement, currList);
    const expectedList = "\"announcements\": [{\"date\":\"01/31/2017 2:50PM\",\"title\":\"orig title\",\"description\":\"orig description\"},{\"title\":\"Test Title\",\"description\":\"Test description\",\"date\":\"1/25/2019 1:02PM\"}]";
    
    expect(updatedAnnouncementsList).toEqual(expectedList);
});

it('delete announcement from portal description', () => {
    const currList = "\"announcements\": [{\"date\":\"01/31/2017 2:50PM\",\"title\":\"orig title\",\"description\":\"orig description\"},{\"title\":\"Test Title\",\"description\":\"Test description\",\"date\":\"1/25/2019 1:02PM\"}]";
    const expectedList = "\"announcements\": [{\"date\":\"01/31/2017 2:50PM\",\"title\":\"orig title\",\"description\":\"orig description\"}]";
    const announcementID = '1/25/2019 1:02PMTest Title';

    const updatedAnnouncementsList = AnnouncementUtils.deleteFromPortal(announcementID, currList);
    
    expect(updatedAnnouncementsList).toEqual(expectedList);
});

it('checks if date format is valid ', () => {
    const invalidDate1 = "2/26/2019 4:05";
    const invalidDate2 = "2/26/2019";
    const invalidDate3 = "2/26/19 4:05PM";
    const validDate = "2/26/2019 4:00AM";

    expect(AnnouncementUtils.isDateInvalid(invalidDate1)).toEqual(true);
    expect(AnnouncementUtils.isDateInvalid(invalidDate2)).toEqual(true);
    expect(AnnouncementUtils.isDateInvalid(invalidDate3)).toEqual(true);
    expect(AnnouncementUtils.isDateInvalid(validDate)).toEqual(false);
});

it('removes text from inside <div> orgDescription json structure </div>', () => {
    const dirtyDescription = "<div class=\"config\" style=\"display:none;\"> <font size=\"4\">For technical support contact the CIGT Support Team </font><font size=\"4\">or call our call: 555-867-5309</font> {     \"helpLink\": \"https://www.arcgis.com\",     \"announcementDialog\": {         \"title\": \"Announcements\",         \"closeButtonText\": \"Close\",         \"neverShowText\": \"Don't show this again until there is a new announcement.\",         \"datePattern\": \"M/dd/yyyy h:ma\",         \"announcements\": []},     \"browseData\": {         \"visible\": false,         \"title\": \"Browse Data by Categories\",         \"categories\": [             {\"name\": \"Farming\", \"link\": \"https://www.google.com\"}         ]     } }  <font size=\"4\"></font><font size=\"4\"><ul><li><font size=\"4\">open portal as an administrator and navigate to Organization/settings/Home page/Organization description</font></li><li>Click edit and click on the View HTML Source button to add the initial announcement json content and and click on save</li><li>refresh/kill browser and verify notification dialog displays.</li><li>go back to Organization description add the following message: For technical support contact the CIGT Support Team CIGT-SUPPORT_TEAM@esri.tech or call: 555-867-5309</li><li>then click save</li><li>kill browser and verify notification dialog displays.</li></ul></font> </div>";
    const cleanDescription = "<font size=\"4\">For technical support contact the Support Team </font><font size=\"4\">or call our call: 555-867-5309</font><font size=\"4\"></font><font size=\"4\"><ul><li><font size=\"4\">open portal as an administrator and navigate to Organization/settings/Home page/Organization description</font></li><li>Click edit and click on the View HTML Source button to add the initial announcement json content and and click on save</li><li>refresh/kill browser and verify notification dialog displays.</li><li>go back to Organization description add the following message: For technical support contact the CIGT Support Team CIGT-SUPPORT_TEAM@esri.tech or call: 555-867-5309</li><li>then click save</li><li>kill browser and verify notification dialog displays.</li></ul></font><div class=\"config\" style=\"display:none;\">  {     \"helpLink\": \"https://www.arcgis.com\",     \"announcementDialog\": {         \"title\": \"Announcements\",         \"closeButtonText\": \"Close\",         \"neverShowText\": \"Don't show this again until there is a new announcement.\",         \"datePattern\": \"M/dd/yyyy h:ma\",         \"announcements\": []},     \"browseData\": {         \"visible\": false,         \"title\": \"Browse Data by Categories\",         \"categories\": [             {\"name\": \"Farming\", \"link\": \"https://www.google.com\"}         ]     } }   </div>";

    const fixedDescription = AnnouncementUtils.removeTextFromJson(dirtyDescription);

    expect(fixedDescription).toEqual(cleanDescription);
});

it('Reformat announcements to be scaped after description was modified by portal org description', () => {
    let inList = [{date:"9/2/2020 11:15AM", description:"DEV Team::<ol><li>Jackie Roberts (<strong>Complaints </strong>Supervisor)</li><li>Gary Nickelson (<strong>Group </strong><span style='color: rgb(230, 0, 0);'>Ownership </span>Tool)</li><li>Brian Dauernheim (<strong>Classification </strong>Tool)</li><li>Richard Yeager (<strong>Announcements </strong>Tool)</li><li>Shannon Brown (All other technical <span style='color: rgb(230, 0, 0);'>issues</span>)</li></ol>", title:"SECOND ANNOUNCEMENT"}];
    let outLit = [{date: "9/2/2020 11:15AM", description: "DEV Team::&lt;ol&gt;&lt;li&gt;Jackie Roberts (&lt;strong&gt;Complaints &lt;/strong&gt;Supervisor)&lt;/li&gt;&lt;li&gt;Gary Nickelson (&lt;strong&gt;Group &lt;/strong&gt;&lt;span style=&#39;color: rgb(230, 0, 0);&#39;&gt;Ownership &lt;/span&gt;Tool)&lt;/li&gt;&lt;li&gt;Brian Dauernheim (&lt;strong&gt;Classification &lt;/strong&gt;Tool)&lt;/li&gt;&lt;li&gt;Richard Yeager (&lt;strong&gt;Announcements &lt;/strong&gt;Tool)&lt;/li&gt;&lt;li&gt;Shannon Brown (All other technical &lt;span style=&#39;color: rgb(230, 0, 0);&#39;&gt;issues&lt;/span&gt;)&lt;/li&gt;&lt;/ol&gt;", title:"SECOND ANNOUNCEMENT"}];
    
    AnnouncementUtils.reformatAnnouncements(inList);

    expect(outLit).toEqual(inList);
});