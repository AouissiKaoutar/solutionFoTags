
function MyTgs() {
    debugger;
    var lookUpfild = "";

    switch (parent.Xrm.Page.data.entity.getEntityName()) {
        case "account":
            lookUpfild = "pte_relatedaccount";
            break;
        case "invoice":
            lookUpfild = "pte_relatedinvoice";

            break;
        case "opportunity":
            lookUpfild = "pte_relatedoportunity";

            break;
        case "salesorder":
            lookUpfild = "pte_relatedorder";

            break;
        case "quote":
            lookUpfild = "pte_relatedquote";

            break;
    }


    var IdRecord = parent.Xrm.Page.data.entity.getId();

    var EntityName = parent.Xrm.Page.data.entity.getEntityName();

    var nameRecord = parent.Xrm.Page.data.entity.getPrimaryAttributeValue();



    var associetedTags = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "  <entity name='pte_relatedentity'>" +
        "    <attribute name='createdon' />" +
        "    <attribute name='pte_relatedtag' />" +
        "    <attribute name='pte_relatedaccount' />" +
        "    <attribute name='createdby' />" +
        "    <attribute name='pte_name2' />" +
        "    <attribute name='pte_relatedentityid' />" +
        "    <order descending='false' attribute='pte_name2' />" +
        "    <filter type='and'>" +
        "      <condition attribute='" + lookUpfild + "' operator='eq'  value='" + IdRecord + "' />" +
        "    </filter>" +
        "  </entity>" +
        "</fetch>"



    associetedTags = "?fetchXml=" + encodeURIComponent(associetedTags);
    debugger;
    parent.Xrm.WebApi.retrieveMultipleRecords("pte_relatedentity", associetedTags).then(
        function success(result) {
            debugger;


            var E = document.getElementById("ulTags");

            for (var i = 0; i < result.entities.length; i++) {


                var para = document.createElement("li");
                //  para.setAttribute('class',result.entities[i]["pte_relatedentityid"]);
                var s = document.createElement("span");
                var t = document.createTextNode(result.entities[i]["_pte_relatedtag_value@OData.Community.Display.V1.FormattedValue"]);
                s.appendChild(t);

                s.setAttribute('id', result.entities[i]["_pte_relatedtag_value"]);
                s.setAttribute('class', "span");
                s.setAttribute('onclick', "openTagRecord(this.id)");


                para.appendChild(s);


                //****************

                var ik = document.createElement("i");
                ik.setAttribute('class', "fermer");
                var xx = document.createTextNode("X");
                ik.appendChild(xx);
                ik.setAttribute('onclick', "suprimer(this.id)");
                ik.setAttribute('id', result.entities[i]["pte_relatedentityid"]);


                para.appendChild(ik);

                E.appendChild(para);



            }
        },
        function (error) {
            console.log(error.message);

        }
    );



}

//************************
