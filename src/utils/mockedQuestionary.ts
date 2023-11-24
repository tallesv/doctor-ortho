// export interface Question {
//   type: string;
//   label: string;
//   value: string;
//   options?: string[];
//   dependsOnLabel?: string;
//   dependsOnValue?: string | boolean;
//   optionsDependOnValue?: {
//     [key: string]: string[];
//   };
// }

// export const myForm: Question[] = [
//   {
//     type: 'select',
//     label: 'Country',
//     value: '',
//     options: ['United States', 'Canada'],
//   },
//   {
//     type: 'select',
//     label: 'State',
//     value: '',
//     dependsOnLabel: 'Country',
//     dependsOnValue: 'United States',
//     options: ['New York', 'Florida'],
//   },
//   {
//     type: 'select',
//     label: 'State',
//     value: '',
//     dependsOnLabel: 'Country',
//     dependsOnValue: 'Canada',
//     options: ['Alberta', 'Quebec'],
//   },
//   {
//     type: 'select',
//     label: 'Favorite color',
//     value: '',
//     options: ['Blue', 'Red'],
//   },
//   {
//     type: 'select',
//     label: 'Favorite Film',
//     value: '',
//     options: ['Jurassic Park', 'Harry Potter'],
//   },
// ];

type FormField = {
  id: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  linkedFields?: { [key: string]: FormField[] }; // Mapping of answer to linked fields
};

type FormTreeNode = {
  field: FormField;
  children?: FormTreeNode[];
};

type FormTree = FormTreeNode[];

// Example form configuration
const exampleForm: FormTree = [
  {
    field: {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
  },
  {
    field: {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      linkedFields: {
        'Other teste': [
          {
            id: 'otherGender',
            label: 'Other Gender',
            type: 'text',
          },
        ],
      },
    },
  },
  {
    field: {
      id: 'interests',
      label: 'Interests',
      type: 'select',
      options: ['Sports', 'Music', 'Reading'],
      linkedFields: {
        Reading: [
          {
            id: 'favoriteBook',
            label: 'Favorite Book',
            type: 'text',
          },
        ],
      },
    },
  },
];
