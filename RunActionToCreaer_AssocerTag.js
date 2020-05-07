//**************************************************************************************

function associateTagToRecord() {
    if (document.getElementById("tagInput").value != "") {

        debugger;


        //Execute the created global action using Web API.


        //get the current organization name
        var serverURL = Xrm.Page.context.getClientUrl();

        //query to send the request to the global Action
        var currentAccountId = parent.Xrm.Page.data.entity.getId();


        var name = parent.Xrm.Page.data.entity.getPrimaryAttributeValue();



        var actionName = "pte_assosTagToEntity";


        //set the current loggedin userid in to _inputParameter of the
        var InputParameterValue = parent.Xrm.Page.context.getUserId();

        //Pass the input parameters of action
        var data = {

            "TagName": document.getElementById("tagInput").value,

            "EntityName": parent.Xrm.Page.data.entity.getEntityName(),

            "recordName": name,

            "recordId": "" + currentAccountId.replace('{', '').replace('}', '')




        };

        //Create the HttpRequestObject to send WEB API Request  


        var req = new XMLHttpRequest();


        //Post the WEB API Request


        req.open("POST", serverURL + "/api/data/v9.1/" + actionName, true);

        req.setRequestHeader("Accept", "application/json");

        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        req.setRequestHeader("OData-MaxVersion", "4.0");

        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {

            if (this.readyState == 4 /* complete */) {

                req.onreadystatechange = null;

                if (this.status == 200 || this.status == 204) {
                    var result = JSON.parse(this.response);


                    alert("Action Executed Successfully....." + result.relationCreated + "     idtag :" + result.tagIdOUTPUT + "***" + result.idRelatedEntity);


                    if (result.relationCreated == 1) {
                        


                        var E = document.getElementById("ulTags");

                        var para = document.createElement("li");
                        //para.setAttribute('class',result.idRelatedEntity);

                        var s = document.createElement("span");
                        var t = document.createTextNode(document.getElementById("tagInput").value);
                        s.appendChild(t);

                        s.setAttribute('id', result.tagIdOUTPUT);

                        s.setAttribute('class', "span");

                        s.setAttribute('onclick', "openTagRecord(this.id)");

                        para.appendChild(s);

                        //****************

                        var ik = document.createElement("i");
                        ik.setAttribute('class', "fermer");
                        var xx = document.createTextNode("X");
                        ik.appendChild(xx);
                        ik.setAttribute('onclick', "suprimer(this.id)");
                        ik.setAttribute('id', result.idRelatedEntity);


                        para.appendChild(ik);



                        E.appendChild(para);



                    }

                    // result = JSON.parse(this.response);
                    //alert(result.MyOutputParameter);
                }

                else {

                    var error = JSON.parse(this.response).error;

                    alert("Error in Action: " + error.message);

                }

            }
        }
    };


    //Execute request passing the input parameter of the action  

    req.send(window.JSON.stringify(data));

}

//*********************

