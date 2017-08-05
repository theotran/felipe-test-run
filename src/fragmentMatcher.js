
import { IntrospectionFragmentMatcher } from 'apollo-client';


const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "INTERFACE",
          name: "Response",
          possibleTypes: [
            { name: "User" },
            { name: "Person" },
            { name: "EmployeeInfo" },
            { name: "Company" },
            { name: "Phone" },
            { name: "Email" },
            { name: "Job" },
            { name: "SingleLine" },
            { name: "Invoice" },
            { name: "Group" },
            { name: "Permission" },
            { name: "AuthResponse" },
            { name: "ErrorResponse" }
          ],
        },
        {
          kind: "UNION",
          name: "Addressable",
          possibleTypes: [
            { name: "Company" },
            { name: "Site" },
            { name: "Person" }
          ],
        },
        {
          kind: "UNION",
          name: "Phoneable",
          possibleTypes: [
            { name: "Person" },
            { name: "Company" },
          ],
        },
        {
          kind: "UNION",
          name: "Noteable",
          possibleTypes: [
            { name: "Design" },
            { name: "Person" }
          ],
        },
        {
          kind: "UNION",
          name: "Sectionable",
          possibleTypes: [
            { name: "Permitting" },
            { name: "Interconnection" }
          ],
        },
        {
          kind: "UNION",
          name: "Costable",
          possibleTypes: [
            { name: "Job" },
            { name: "Breaker" },
            { name: "Combiner" },
            { name: "Construction" },
            { name: "Design" },
            { name: "Engineering" },
            { name: "Fuse" },
            { name: "Inspection" },
            { name: "Interconnection" },
            { name: "Inverter" },
            { name: "Item" },
            { name: "Monitor" },
            { name: "Optimizer" },
            { name: "Order" },
            { name: "Panel" },
            { name: "Permitting" },
            { name: "Preview" },
            { name: "Section" }
          ],
        },
        {
          kind: "UNION",
          name: "Commentable",
          possibleTypes: [
            { name: "Engineering" },
            { name: "Review" }
          ],
        },
        {
          kind: "UNION",
          name: "Taskable",
          possibleTypes: [
            { name: "Design" },
            { name: "Preview" },
            { name: "Site" },
            { name: "Permitting" },
            { name: "Engineering" },
            { name: "Review" },
            { name: "Interconnection" }
          ],
        },
        {
          kind: "UNION",
          name: "Itemable",
          possibleTypes: [
            { name: "Panel" },
            { name: "Inverter" },
            { name: "Optimizer" },
            { name: "Combiner" },
            { name: "Panelboard" },
            { name: "Fuse" },
            { name: "Breaker" },
            { name: "Monitor" }
          ],
        },
        {
          kind: "UNION",
          name: "Reviewable",
          possibleTypes: [
            { name: "Design" },
            { name: "Section" }
          ],
        },
        {
          kind: "UNION",
          name: "Contractable",
          possibleTypes: [
            { name: "Person" },
            { name: "Company" }
          ],
        },
        {
          kind: "UNION",
          name: "Groupable",
          possibleTypes: [
            { name: "Person" },
            { name: "User" },
            { name: "Company" }
          ],
        },
        {
          kind: "UNION",
          name: "Reviewerable",
          possibleTypes: [
            { name: "Person" },
            { name: "Company" }
          ],
        },
      ],
    },
  }
});

export default fragmentMatcher;
