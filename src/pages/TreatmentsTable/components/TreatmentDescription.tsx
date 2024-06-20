interface TreatmentDescriptionProps {
  description: string;
}

function firstPhraseBold(text: string) {
  // Find the position of the first period or dash
  const periodIndex = text.indexOf(',');
  const dashIndex = text.indexOf('-');

  // Determine the index to use for splitting (the smaller of the two positive indices)
  let splitIndex;
  if (periodIndex === -1 && dashIndex === -1) {
    splitIndex = text.length; // No period or dash found, use the whole text
  } else if (periodIndex === -1) {
    splitIndex = dashIndex;
  } else if (dashIndex === -1) {
    splitIndex = periodIndex;
  } else {
    splitIndex = Math.min(periodIndex, dashIndex);
  }
  const firstPhrase = text.substring(0, splitIndex + 1);
  const restOfText = text.substring(splitIndex + 1);
  return (
    <div>
      <span className="font-bold dark:text-white">{firstPhrase}</span>
      {restOfText}
    </div>
  );
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
            {firstPhraseBold(description)}
          </li>
        ))}
      </ul>
    );
  }

  return firstPhraseBold(description);
}
