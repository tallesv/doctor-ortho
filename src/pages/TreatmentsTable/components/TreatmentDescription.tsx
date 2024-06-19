interface TreatmentDescriptionProps {
  description: string;
}

export function TreatmentDescription({
  description,
}: TreatmentDescriptionProps) {
  function splitByOptions(text: string) {
    // Use regex to find the pattern of 'numberª opção:'
    const pattern = /\d+ª opção:/g;

    // Find all occurrences of the pattern
    const matches = text.match(pattern);

    // Split the text based on the pattern
    const splitText = text.split(pattern);

    // The first element of splitText is empty, as split() starts splitting from the match, so we need to remove it.
    splitText.shift();

    // Prepend the matches to the split text
    const result = splitText.map(
      (item, index) => matches?.[index] + ' ' + item.trim(),
    );

    return result;
  }

  const splitDescription = splitByOptions(description);

  if (splitDescription.length > 0) {
    return (
      <ul>
        {splitDescription.map(description => (
          <li key={description} className="py-2">
            {description}
          </li>
        ))}
      </ul>
    );
  }

  return description;
}
