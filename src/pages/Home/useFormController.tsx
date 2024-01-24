import { useFormContext } from 'react-hook-form';
import { FormField, FormTreeNode } from '../../utils/mockedQuestionary';

export function useFormController() {
  const { getValues } = useFormContext<FormData>();

  function findLinkedField(
    linkedFieldId: string,
    node: FormTreeNode,
  ): FormField | undefined {
    // Check if the linked field has already been found
    if (node.field.id === linkedFieldId) {
      return node.field;
    }

    // Variable to track if the linked field is found
    let linkedFieldFound = false;

    if (node.children) {
      // Iterate through children only if the linked field is not found
      if (!linkedFieldFound) {
        for (const child of node.children) {
          const result = findLinkedField(linkedFieldId, child);

          // If the linked field is found in the child node, set the variable to true
          if (result) {
            linkedFieldFound = true;
            return result;
          }
        }
      }
    }

    // Return undefined if the linked field is not found
    return undefined;
  }

  // Recursive function to find a field with a specific linked_id
  const findFieldByLinkedId = (
    linkedId: string,
    node: FormTreeNode,
  ): FormField | undefined => {
    if (node.field.id === linkedId) {
      return node.field;
    }

    if (node.children) {
      for (const child of node.children) {
        const foundField = findFieldByLinkedId(linkedId, child);
        if (foundField) {
          return foundField;
        }
      }
    }

    return undefined;
  };

  // Recursive function to find a field with a specific linked_id across the entire FormTree
  const findFieldByLinkedIdInTree = (
    linkedId: string,
    formTree: FormTreeNode[],
  ): FormField | undefined => {
    for (const node of formTree) {
      const foundField = findFieldByLinkedId(linkedId, node);
      if (foundField) {
        return foundField;
      }
    }

    return undefined;
  };

  function buildFields(form: FormTreeNode) {
    const fieldIds = [];

    const { field, children } = form;

    fieldIds.push(field.id);

    if (children) {
      children.forEach(child => {
        const linkedField = field.linked_id
          ? findLinkedField(field.linked_id, form)
          : null;

        if (
          !field.linked_id ||
          (linkedField?.id === field.linked_id &&
            getValues().get(field.linked_id) === field.linked_awnswer)
        ) {
          fieldIds.push(...buildFields(child));
        }
      });
    }
    return fieldIds;
  }

  return {
    findFieldByLinkedIdInTree,
    buildFields,
  };
}
