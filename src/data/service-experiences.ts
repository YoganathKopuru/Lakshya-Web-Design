export type Experience = { title: string; motif: string; steps: readonly { label: string; title: string; description: string }[] };
export const experiences: Record<string, Experience> = {
  'ai-data': { title:'Knowledge into intelligence', motif:'KNOWLEDGE FLOW', steps:[
    {label:'Collect',title:'Start with your knowledge',description:'Bring relevant documents and business knowledge into a connected information layer.'},
    {label:'Retrieve',title:'Find the right context',description:'Retrieve relevant information so a response can be grounded in your knowledge.'},
    {label:'Reason',title:'Connect context with intent',description:'Combine the question and retrieved context in an AI-assisted workflow.'},
    {label:'Respond',title:'Make knowledge useful',description:'Present an answer that people can review, verify and put to work.'},
  ]},
  'software-engineering': { title:'From idea to working software', motif:'SOFTWARE DELIVERY', steps:[
    {label:'Define',title:'Frame the challenge',description:'Turn user needs and business requirements into a clear development direction.'},
    {label:'Build',title:'Shape the experience',description:'Connect application logic, interfaces and integrations in working software.'},
    {label:'Test',title:'Validate the behavior',description:'Review functionality, usability and integration before moving toward release.'},
    {label:'Release',title:'Bring it to your users',description:'Prepare a considered release and keep improving with real-world feedback.'},
  ]},
  'enterprise-platforms': { title:'One connected business', motif:'ENTERPRISE CONNECTIONS', steps:[
    {label:'Customer',title:'Connect customer information',description:'Bring customer workflows into the wider business platform landscape.'},
    {label:'Inventory',title:'Keep operations aligned',description:'Connect inventory and operational information with the systems teams use.'},
    {label:'People',title:'Support the employee journey',description:'Align people processes, HRMS and payroll around your organization.'},
    {label:'Insights',title:'Create a shared view',description:'Bring connected information into reporting that supports daily decisions.'},
  ]},
  'cloud-devops': { title:'A clearer path to delivery', motif:'CLOUD DELIVERY', steps:[
    {label:'Commit',title:'Start with a change',description:'Bring versioned application changes into a repeatable delivery workflow.'},
    {label:'Build',title:'Create a consistent package',description:'Prepare the application and its dependencies for the target environment.'},
    {label:'Validate',title:'Check before release',description:'Use agreed checks to validate changes before they reach users.'},
    {label:'Deploy',title:'Operate with visibility',description:'Release to the environment and observe application behavior over time.'},
  ]},
  'semiconductor-vlsi': { title:'Explore the silicon system', motif:'SILICON BLUEPRINT', steps:[
    {label:'Logic',title:'Define the behavior',description:'Translate a design requirement into logic and system behavior.'},
    {label:'Memory',title:'Connect the building blocks',description:'Consider how data, memory and functional blocks work together.'},
    {label:'I/O',title:'Design the interfaces',description:'Explore the interfaces that connect the silicon system to its environment.'},
    {label:'Verify',title:'Verify the intent',description:'Plan verification around the expected behavior and the program requirements.'},
  ]},
  'embedded-iot': { title:'From device to decision', motif:'CONNECTED SYSTEM', steps:[
    {label:'Sense',title:'Capture a physical signal',description:'Start with the device inputs and measurements that matter to the application.'},
    {label:'Process',title:'Make sense at the edge',description:'Use embedded software to interpret inputs and coordinate device behavior.'},
    {label:'Connect',title:'Move information securely',description:'Connect devices and platforms through an appropriate communication path.'},
    {label:'Act',title:'Bring information into view',description:'Turn connected information into a useful interface or operational action.'},
  ]},
  'quality-managed-services': { title:'Confidence, built into delivery', motif:'QUALITY WORKFLOW', steps:[
    {label:'Plan',title:'Define what good looks like',description:'Agree on the expected behavior, test scope and operational priorities.'},
    {label:'Test',title:'Exercise the system',description:'Explore application behavior through relevant test and validation activities.'},
    {label:'Review',title:'Understand the findings',description:'Review findings with the team and prioritize the next improvements.'},
    {label:'Support',title:'Keep improving in operation',description:'Bring observations and support needs back into the improvement cycle.'},
  ]},
  'talent-solutions': { title:'Build the right delivery team', motif:'TEAM ASSEMBLY', steps:[
    {label:'Define',title:'Start with your requirements',description:'Define the skills, responsibilities and working model your project needs.'},
    {label:'Align',title:'Explore relevant expertise',description:'Align technical experience and availability with the engagement requirements.'},
    {label:'Assemble',title:'Connect the right people',description:'Shape a team around the skills and collaboration your delivery needs.'},
    {label:'Deliver',title:'Work toward a shared goal',description:'Bring people into the delivery process with clear roles and communication.'},
  ]},
};
