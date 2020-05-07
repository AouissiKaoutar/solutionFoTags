using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Activities;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk;
using System.Activities.Statements;

using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System.ServiceModel.Description;
using Microsoft.Xrm.Sdk.Query;

namespace assosTagToEntity
{
    public class Class1 : CodeActivity
    {
        //pte_associateTagToRecord
        [Input("TagName")]
        public InArgument<string> TagName { get; set; }
        [Input("idTag")]
        public InArgument<string> idTag { get; set; }
        [Input("EntityName")]
        public InArgument<string> EntityName { get; set; }
        [Input(" recordName")]
        public InArgument<string> recordName { get; set; }
        [Input("idRecord")]
        public InArgument<string> idRecord { get; set; }
          
               [Output("relationCreated")]
               public OutArgument<int> relationCreated { get; set; }


                [Output("tagIdOUTPUT")]
                public OutArgument<string> tagIdOUTPUT { get; set; }


        [Output("idRelatedEntity")]
        public OutArgument<string> idRelatedEntity { get; set; }


        private static EntityCollection GetEntityCollection(IOrganizationService service, string entityName, string attributeName, string attributeValue, ColumnSet cols)
              {
             QueryExpression query = new QueryExpression
                  {
                      EntityName = entityName,
                      ColumnSet = cols,
                      Criteria = new FilterExpression
                      {
                          Conditions =
                          {
                          new ConditionExpression
                          {
                          AttributeName = attributeName,
                          Operator = ConditionOperator.Equal,
                          Values = { attributeValue }
                          }
                          }
                      }
                  };
                  return service.RetrieveMultiple(query);
              }
              protected override void Execute(CodeActivityContext executionContext)
              {
               //   throw new NotImplementedException(" k This is just a test !!!!!!/n Tag Name= " + executionContext.GetValue(TagName) + "***
        //n idTag =" + executionContext.GetValue(idTag) + "/n * *EntityName = " + executionContext.GetValue(EntityName)+"/n**RecordName=" + executionContext.GetValue(recordName) + "idRrecord" + executionContext.GetValue(idRecord));        


            // Getting OrganizationService from Context  
            var workflowContext = executionContext.GetExtension<IWorkflowContext>();
            var serviceFactory = executionContext.GetExtension<IOrganizationServiceFactory>();
            var orgService = serviceFactory.CreateOrganizationService(workflowContext.UserId);

            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            
            Guid recordId = context.PrimaryEntityId;

           

            relationCreated.Set(executionContext,50);

            EntityCollection ec = null;
            ec = GetEntityCollection(orgService, "pte_tag", "pte_name", executionContext.GetValue(TagName), new ColumnSet("pte_tagid", "pte_name"));
            Guid idtag = Guid.Empty;
            if (ec.Entities.Count > 0) //Check for EntityCollection count
            {

                foreach (var item in ec.Entities)//on a un seul record ;
                {
                    idtag = new Guid(item.Attributes["pte_tagid"].ToString());
                }
            }

            if (ec.Entities.Count == 0)
            {
                Entity newTag = new Entity("pte_tag");
                newTag["pte_name"] = executionContext.GetValue(TagName);
                idtag = orgService.Create(newTag);
            }



            executionContext.SetValue(idRelatedEntity, "");
            tagIdOUTPUT.Set(executionContext, idtag.ToString());

            string lookUpfild = "";

            switch (executionContext.GetValue(EntityName))
            {
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




     var fetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
                                     <entity name='pte_relatedentity'>
                                       <attribute name='createdon' />
                                       <attribute name='pte_relatedtag' />
                                       <attribute name='pte_relatedaccount' />
                                       <attribute name='createdby' />
                                       <attribute name='pte_name2' />
                                       <attribute name='pte_relatedentityid' />
                                       <order descending='false' attribute='pte_name2' />
                                       <filter type='and'>
                                         <filter type='and'>
                                           <condition attribute='pte_relatedtag' operator='eq'  uitype='pte_tag' value='{" + idtag.ToString() + @"}' />
                                           <condition attribute='"+lookUpfild+@"' operator='eq' uitype='" + executionContext.GetValue(EntityName) + @"' value='{" + executionContext.GetValue(idRecord) + @"}' />
                                         </filter>
                                       </filter>
                                     </entity>
                                   </fetch>";


            EntityCollection relatedEntityRecord = orgService.RetrieveMultiple(new FetchExpression(fetchXml));

            if (relatedEntityRecord.Entities.Count == 0)
            {
                Entity newRelatedEntity = new Entity("pte_relatedentity");

                newRelatedEntity["pte_relatedtag"] = new EntityReference("pte_tag", idtag);
                newRelatedEntity[lookUpfild] = new EntityReference(executionContext.GetValue(EntityName), new Guid(executionContext.GetValue(idRecord)));

               var idRE= orgService.Create(newRelatedEntity);

               executionContext.SetValue(relationCreated, 1);

               executionContext.SetValue(idRelatedEntity, idRE.ToString());

            }

            
            //  throw new InvalidPluginExecutionException("Message.... /n" + executionContext.GetValue(relationCreated) + "idTag" + executionContext.GetValue(tagIdOUTPUT));

        }
    }
}















