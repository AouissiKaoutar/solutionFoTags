//************************



//***************************


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
        "      <condition attribute='" + lookUpfild + "' operator='eq'  uitype='" + EntityName + "' value='" + IdRecord + "' />" +
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

function retrivMineOther() {
    debugger;
    onLoad_Events();

    debugger;
    MyTgs();

    var MyTags = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "  <entity name='pte_tag'>" +
        "    <attribute name='pte_tagid' />" +
        "    <attribute name='pte_name' />" +
        "    <attribute name='createdon' />" +
        "    <order attribute='pte_name' descending='false' />" +
        "    <filter type='and'>" +
        "      <condition attribute='ownerid' operator='eq-userid' />" +
        "    </filter>" +
        "  </entity>" +
        "</fetch>"



    MyTags = "?fetchXml=" + encodeURIComponent(MyTags);
    parent.Xrm.WebApi.retrieveMultipleRecords("pte_tag", MyTags).then(
        function success(result) {



            var E = document.getElementById("mine");

            for (var i = 0; i < result.entities.length; i++) {

                console.log(result.entities[i]);

                var para = document.createElement("option");
                para.setAttribute('value', result.entities[i].pte_name);

                var t = document.createTextNode(result.entities[i].pte_name);
                para.appendChild(t);

                E.appendChild(para);
            }

        },
        function (error) {
            console.log(error.message);

        }
    );


    var Others = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "  <entity name='pte_tag'>" +
        "    <attribute name='pte_tagid' />" +
        "    <attribute name='pte_name' />" +
        "    <attribute name='createdon' />" +
        "    <order attribute='pte_name' descending='false' />" +
        "    <filter type='and'>" +
        "      <condition attribute='ownerid' operator='ne-userid' />" +
        "    </filter>" +
        "  </entity>" +
        "</fetch>"


    Others = "?fetchXml=" + encodeURIComponent(Others);
    parent.Xrm.WebApi.retrieveMultipleRecords("pte_tag", Others).then(
        function success(result) {



            var E = document.getElementById("other");

            for (var i = 0; i < result.entities.length; i++) {

                console.log(result.entities[i]);

                var para = document.createElement("option");
                para.setAttribute('value', result.entities[i].pte_name);

                var t = document.createTextNode(result.entities[i].pte_name);
                para.appendChild(t);


                E.appendChild(para);
            }

        },
        function (error) {
            console.log(error.message);

        }
    );
}









//********************************************************

function suprimer(idRE) {
    debugger;
    // Delete Account record
    Xrm.WebApi.deleteRecord("pte_relatedentity", idRE).then(
        function success(result) {

            var element = document.getElementById(idRE).parentElement;

            element.parentNode.removeChild(element);

   // Perform operations on record deletion
            Xrm.Utility.alertDialog(" deleted succes..", null);
        },
        function (error) {
            // Handle error conditions
            Xrm.Utility.alertDialog(error.message, null);
        });
}


///*****************************************************

function onLoad_Events() {
    debugger;

    var formType = Xrm.Page.ui.getFormType(); //get the form type
    var form = Xrm.Page.ui.formSelector.getCurrentItem().getLabel(); //look for the form name

    if (formType == 1) //creation form
    {

        var control = Xrm.Page.ui.controls.get("WebResource_myTags");

        control.setVisible(false);
    }
}

//**************************************************


function openTagRecord(idT) {
    debugger;

    parent.Xrm.Utility.openEntityForm("pte_tag", idT);

}


